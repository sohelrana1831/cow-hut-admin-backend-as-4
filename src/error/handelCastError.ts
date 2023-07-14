import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interface/error";

const handelCastError = (errors: mongoose.Error.CastError) => {
  const error: IGenericErrorMessage[] = [
    {
      path: errors.path,
      message: "Cast Error",
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid id",
    errorMessage: error,
  };
};

export default handelCastError;
