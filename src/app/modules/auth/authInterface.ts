import { Types } from "mongoose";
import { IUser } from "../user/userInterface";

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  phoneNumber: string;
  password: string;
};
