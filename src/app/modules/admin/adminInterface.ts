import { Model, Types } from "mongoose";

export type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id: Types.ObjectId;
  phoneNumber: string;
  role: "admin";
  password?: string;
  name: AdminName;
  address: string;
};

export type IAdminFilters = {
  searchTerm?: string;
  phoneNumber?: number;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

// Put all admin instance methods in this interface:
export type IAdminMethods = {
  isAdminExistByPhone(phoneNumber: string): Promise<Partial<IAdmin> | null>;

  isAdminExistById(phoneNumber: string): Promise<Partial<IAdmin> | null>;

  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;
