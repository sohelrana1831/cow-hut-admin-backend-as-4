"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z
            .enum(["seller", "buyer"])
            .refine((value) => value !== undefined && value !== null, {
            message: "Role is required!",
            path: ["role"],
        }),
        phoneNumber: zod_1.z.string({
            required_error: "Phone Number is required!",
        }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: "First name is required!" }),
            lastName: zod_1.z.string({ required_error: "Last name is required!" }),
        }),
        address: zod_1.z.string({
            required_error: "Address is required!",
        }),
        password: zod_1.z.string().optional(),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional().default(0),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
};
