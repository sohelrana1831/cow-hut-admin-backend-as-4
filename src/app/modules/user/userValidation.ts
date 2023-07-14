import { z } from "zod";
const createUserZodSchema = z.object({
  body: z.object({
    role: z
      .enum(["seller", "buyer"])
      .refine((value) => value !== undefined && value !== null, {
        message: "Role is required!",
        path: ["role"],
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
    budget: z.number().optional(),
    income: z.number().optional().default(0),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
