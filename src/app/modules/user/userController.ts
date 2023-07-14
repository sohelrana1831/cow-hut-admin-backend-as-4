import { RequestHandler } from "express";
import { UserServices } from "./userServices";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import { IUser } from "./userInterface";
import sendResponse from "../../../shared/sendResponse";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await UserServices.createUser(user);
  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Create user successfully!",
    data: result,
  });
});

const getAllUres: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();

  sendResponse<IUser[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUser(id);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const result = await UserServices.updateUser(id, user);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.deleteUser(id);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUres,
  getSingleUser,
  updateUser,
  deleteUser,
};
