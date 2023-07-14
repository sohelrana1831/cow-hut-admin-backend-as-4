import httpStatus from "http-status";
import ApiError from "../../../error/ApiError";
import { User } from "../user/userModel";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./authInterface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import { IUser } from "../user/userInterface";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;
  const user = new User();
  const isUserExist = await user.isUserExistByPhone(phoneNumber);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await user.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  //create access token and refresh token
  const { _id: UserId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { _id: UserId, role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { _id: UserId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expire_in as string
  );

  return { accessToken, refreshToken };
};

const signUp = async (user: IUser): Promise<IUser | null> => {
  const isExist = await User.findOne({
    phoneNumber: user.phoneNumber,
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Already exists!");
  }
  const newCreatedUser = await User.create(user);

  const userData = await User.findById(newCreatedUser._id);

  return userData;
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { _id: id } = verifiedToken;
  const user = new User();

  const isUserExist = await user.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  signUp,
};
