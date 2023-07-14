import mongoose from "mongoose";
import { ICow } from "../cow/cowInterface";
import { Cow } from "../cow/cowModel";
import { IUser } from "../user/userInterface";
import { User } from "../user/userModel";
import { IOrder } from "./orderInterface";
import { Order } from "./orderModel";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../error/ApiError";
import httpStatus from "http-status";

const createOrders = async (payload: IOrder): Promise<IOrder | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const getCowData = await Cow.findById(payload.cow).session(session).exec();
    const getBuyerData = await User.findById(payload.buyer)
      .session(session)
      .exec();
    const getSellerData = await User.findById(getCowData?.seller)
      .session(session)
      .exec();

    if (!getCowData || !getBuyerData || !getSellerData) {
      throw new Error("Unable to find cow data, buyer data, or seller data");
    }

    if (getCowData.label === "sold out") {
      throw new Error("Cow is sold out!");
    }

    if (getBuyerData.budget < getCowData.price) {
      throw new Error("Insufficient balance to buy this Cow!");
    }

    const updateCowLabel = { label: "sold out" };
    const updateSellerIncome = {
      income: getSellerData.income + getCowData.price,
    };
    const updateBuyerBudget = {
      budget: getBuyerData.budget - getCowData.price,
    };

    const options = { new: true, session };

    const cowUpdatePromise = Cow.findOneAndUpdate(
      { _id: payload.cow },
      updateCowLabel,
      options
    ).session(session);
    const sellerUpdatePromise = User.findOneAndUpdate(
      { _id: getCowData.seller },
      updateSellerIncome,
      options
    ).session(session);
    const buyerUpdatePromise = User.findOneAndUpdate(
      { _id: payload.buyer },
      updateBuyerBudget,
      options
    ).session(session);

    const [cowUpdate, sellerUpdate, buyerUpdate] = await Promise.all([
      cowUpdatePromise,
      sellerUpdatePromise,
      buyerUpdatePromise,
    ]);

    if (!cowUpdate || !sellerUpdate || !buyerUpdate) {
      throw new Error("Failed to update cow, seller, or buyer data!");
    }

    const createdOrder = await Order.create(payload);
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate({
        path: "cow",
        populate: [{ path: "seller" }],
      })
      .populate("buyer")
      .lean();

    if (!populatedOrder) {
      throw new Error("Failed to create order!");
    }

    await session.commitTransaction();
    return populatedOrder as unknown as IOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getOrders = async (): Promise<IOrder[]> => {
  const result = await Order.find({});
  return result;
};

const getSingleOrder = async (
  orderId: string,
  payload: JwtPayload
): Promise<IOrder> => {
  const { _id: id, role } = payload;
  let query = {};

  if (role === "buyer") {
    query = { _id: orderId, buyer: id }; // Query to match seller or buyer ID
  } else if (role === "seller") {
    query = { _id: orderId, "cow.seller": id };
  }

  const result = await Order.findOne(query)
    .populate({
      path: "cow",
      populate: [{ path: "seller" }],
    })
    .populate("buyer")
    .lean();
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "No order found!");
  }
  return result;
};

export const OrderServices = {
  createOrders,
  getOrders,
  getSingleOrder,
};
