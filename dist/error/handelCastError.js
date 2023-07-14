"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handelCastError = (errors) => {
    const error = [
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
exports.default = handelCastError;
