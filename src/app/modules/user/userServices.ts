import { User } from "./userModel";
import { IUser } from "./userInterface";
import config from "../../../config";
import ApiError from "../../../error/ApiError";
import httpStatus from "http-status";

const createUser = async (user: IUser): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.user_default_password as string;
  }

  const createUser = await User.create(user);
  if (!createUser) {
    throw new Error("Failed to create user!");
  }

  return createUser;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({});
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id });
  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Id!");
  }
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
