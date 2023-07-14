"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const adminConstant_1 = require("./adminConstant");
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum([...adminConstant_1.adminRoles], {
            required_error: "Role required!",
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
    }),
});
const adminLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({ required_error: "password is required!" }),
        phoneNumber: zod_1.z.string({ required_error: "phone number is required!" }),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
    adminLoginZodSchema,
};
