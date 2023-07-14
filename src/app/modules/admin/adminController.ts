import { CookieOptions, Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import { paginationFieldOptions } from "../../../constants/pagination";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { AdminServices } from "./adminServices";
import { IAdmin, ILoginAdminResponse } from "./adminInterface";
import { adminFilterableFields } from "./adminConstant";
import config from "../../../config";

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { ...adminData } = req.body;
  const result = await AdminServices.createAdmin(adminData);
  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Create admin successfully!",
    data: result,
  });
});

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const paginationOptions = pick(req.query, paginationFieldOptions);

  const result = await AdminServices.getAllAdmin(filters, paginationOptions);

  sendResponse<IAdmin[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully !",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.getSingleAdmin(id);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await AdminServices.updateAdmin(id, data);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminServices.deleteAdmin(id);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin deleted successfully",
    data: result,
  });
});

const loginAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;
  const result = await AdminServices.loginAdmin(loginData);

  const { refreshToken, ...others } = result;

  const cookieOptions: CookieOptions = {
    secure: config.node_env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New access token generated successfully !",
    data: others,
  });
});

export const AdminController = {
  createAdmin,
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
};
