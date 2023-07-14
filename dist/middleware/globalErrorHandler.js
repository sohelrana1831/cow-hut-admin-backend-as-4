"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const handleValidationError_1 = __importDefault(require("../error/handleValidationError"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const handelZodError_1 = __importDefault(require("../error/handelZodError"));
const handelCastError_1 = __importDefault(require("../error/handelCastError"));
const zod_1 = require("zod");
const globalErrorHandler = (error, req, res, next) => {
    config_1.default.node_env === "development" &&
        console.log(`💣 globalErrorHandler`, error);
    let statusCode = 500;
    let message = "something went wrong !";
    let errorMessage = [];
    //   conditionally error handler
    if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const makeAsCommonError = (0, handleValidationError_1.default)(error);
        statusCode = makeAsCommonError.statusCode;
        message = makeAsCommonError.message;
        errorMessage = makeAsCommonError.errorMessage;
    }
    else if (error instanceof zod_1.ZodError) {
        const simplifiedZodErrorMessage = (0, handelZodError_1.default)(error);
        statusCode = simplifiedZodErrorMessage.statusCode;
        message = simplifiedZodErrorMessage.message;
        errorMessage = simplifiedZodErrorMessage.errorMessage;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const simplifiedZodErrorMessage = (0, handelCastError_1.default)(error);
        statusCode = simplifiedZodErrorMessage.statusCode;
        message = simplifiedZodErrorMessage.message;
        errorMessage = simplifiedZodErrorMessage.errorMessage;
    }
    else if (error instanceof ApiError_1.default) {
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
    }
    else if (error instanceof Error) {
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
        stack: config_1.default.node_env !== "production" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
    next();
};
exports.default = globalErrorHandler;
