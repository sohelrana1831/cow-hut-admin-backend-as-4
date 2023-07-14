import ApiError from "../../../error/ApiError";
import httpStatus from "http-status";
import {
  IAdmin,
  IAdminFilters,
  ILoginAdmin,
  ILoginAdminResponse,
} from "./adminInterface";
import { IPaginationOptions } from "../../../interface/pagination";
import { IGenericResponse } from "../../../interface/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { adminSearchableFields } from "./adminConstant";
import { SortOrder } from "mongoose";
import { Admin } from "./adminModel";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";

const createAdmin = async (payload: IAdmin): Promise<IAdmin | null> => {
  if (!payload.password) {
    payload.password = config.admin_default_password as string;
  }

  const admin = new Admin();
  const isExist = await admin.isAdminExistByPhone(payload.phoneNumber);
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin Already exists!");
  }

  const result = await Admin.create(payload);
  if (!result) {
    throw new Error("Failed to create admin Data!");
  }
  return await Admin.findOne(
    { phoneNumber: result.phoneNumber },
    { password: 0 }
  );
  // return result;
};

const getAllAdmin = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        // Add a $regex condition with the 'i' option for case-insensitive search
        return {
          [field]: {
            $regex: new RegExp(String(value), "i"),
          },
        };
      }),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const result = await Admin.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findByIdAndDelete({ _id: id });
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Id!");
  }
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginAdminResponse> => {
  const { phoneNumber, password } = payload;
  const admin = new Admin();
  const isUserExist = await admin.isAdminExistByPhone(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin does not exist!");
  }

  if (
    isUserExist.password &&
    !(await admin.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password does not match!");
  }

  //create access token and refresh token
  const { _id, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id: _id, role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { id: _id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expire_in as string
  );

  return { accessToken, refreshToken };
};
export const AdminServices = {
  createAdmin,
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
};
