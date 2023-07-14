import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import { CowServices } from "./cowServices";
import { cowFilterableFields } from "./cowConstant";
import { paginationFieldOptions } from "../../../constants/pagination";
import pick from "../../../shared/pick";
import { ICow } from "./cowInterface";
import sendResponse from "../../../shared/sendResponse";

const createCow: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await CowServices.createCow(data);
  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Create cow successfully!",
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFieldOptions);

  const result = await CowServices.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cow retrieved successfully !",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CowServices.getSingleCow(id);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cow retrieved successfully",
    data: result,
  });
});

const updateCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const cow = req.body;
  const result = await CowServices.updateCow(id, cow);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cow updated successfully",
    data: result,
  });
});

const deleteCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CowServices.deleteCow(id);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Cow deleted successfully",
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
