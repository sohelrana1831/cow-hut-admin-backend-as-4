import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../config";
import { IGenericErrorMessage } from "../interface/error";
import handelValidationError from "../error/handleValidationError";
import ApiError from "../error/ApiError";
import handleZodError from "../error/handelZodError";
import handelCastError from "../error/handelCastError";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.node_env === "development" &&
    console.log(`💣 globalErrorHandler`, error);
  let statusCode = 500;
  let message = "something went wrong !";
  let errorMessage: IGenericErrorMessage[] = [];

  //   conditionally error handler
  if (error?.name === "ValidationError") {
    const makeAsCommonError = handelValidationError(error);
    statusCode = makeAsCommonError.statusCode;
    message = makeAsCommonError.message;
    errorMessage = makeAsCommonError.errorMessage;
  } else if (error instanceof ZodError) {
    const simplifiedZodErrorMessage = handleZodError(error);
    statusCode = simplifiedZodErrorMessage.statusCode;
    message = simplifiedZodErrorMessage.message;
    errorMessage = simplifiedZodErrorMessage.errorMessage;
  } else if (error?.name === "CastError") {
    const simplifiedZodErrorMessage = handelCastError(error);
    statusCode = simplifiedZodErrorMessage.statusCode;
    message = simplifiedZodErrorMessage.message;
    errorMessage = simplifiedZodErrorMessage.errorMessage;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessage = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessage = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  }

  //   Error Response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.node_env !== "production" ? error?.stack : undefined,
  });
  next();
};

export default globalErrorHandler;
