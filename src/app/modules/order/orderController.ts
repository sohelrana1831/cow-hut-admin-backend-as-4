import { RequestHandler } from "express";
import { OrderServices } from "./orderServices";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IOrder } from "./orderInterface";

const createOrders: RequestHandler = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await OrderServices.createOrders(data);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Create Order successfully!",
    data: result,
  });
});

const getOrders: RequestHandler = catchAsync(async (req, res) => {
  const result = await OrderServices.getOrders();

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getSingleOrder: RequestHandler = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const result = await OrderServices.getSingleOrder(orderId, req.user);
  sendResponse<IOrder | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully!",
    data: result,
  });
});

export const OrderController = {
  createOrders,
  getOrders,
  getSingleOrder,
};
