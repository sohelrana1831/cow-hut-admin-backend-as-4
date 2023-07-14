import { Model, Types } from "mongoose";

export type IUser = {
  _id: Types.ObjectId;
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  address: string;
  budget: number;
  income?: number;
};

//  User Exist instance methods
type IUserModelMethodsType = {
  isUserExistByPhone(
    phoneNumber: string
  ): Promise<Pick<IUser, "password" | "role" | "phoneNumber" | "_id">>;

  isUserExist(id: string): Promise<Partial<IUser> | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type UserModel = Model<
  IUser,
  Record<string, unknown>,
  IUserModelMethodsType
>;
