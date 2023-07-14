import { Model, Types } from "mongoose";
import { IUser } from "../user/userInterface";
import { ICow } from "../cow/cowInterface";

export type IOrder = {
  cow: Types.ObjectId | ICow; // Assuming cow ID is a string
  buyer: Types.ObjectId | IUser; // Assuming buyer user ID is a string
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
