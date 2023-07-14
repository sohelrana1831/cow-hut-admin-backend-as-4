import { z } from "zod";
import { adminRoles } from "./adminConstant";
const createAdminZodSchema = z.object({
  body: z.object({
    role: z.enum([...adminRoles] as [string, ...string[]], {
      required_error: "Role required!",
    }),
    phoneNumber: z.string({
      required_error: "Phone Number is required!",
    }),

    name: z.object({
      firstName: z.string({ required_error: "First name is required!" }),
      lastName: z.string({ required_error: "Last name is required!" }),
    }),

    address: z.string({
      required_error: "Address is required!",
    }),

    password: z.string().optional(),
  }),
});

const adminLoginZodSchema = z.object({
  body: z.object({
    password: z.string({ required_error: "password is required!" }),
    phoneNumber: z.string({ required_error: "phone number is required!" }),
  }),
});

export const AdminValidation = {
  createAdminZodSchema,
  adminLoginZodSchema,
};
