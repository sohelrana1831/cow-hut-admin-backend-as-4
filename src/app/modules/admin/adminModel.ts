import { Schema, model } from "mongoose";
import { AdminModel, IAdmin } from "./adminInterface";
import { adminRoles } from "./adminConstant";
import bcrypt from "bcrypt";
import config from "../../../config";

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: adminRoles,
      required: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    phoneNumber: {
      unique: true,
      required: true,
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.methods.isAdminExistByPhone = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, "phoneNumber" | "password" | "role" | "_id"> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { name: 1, password: 1, role: 1, phoneNumber: 1, _id: 1 }
  ).lean();
};

AdminSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

AdminSchema.pre("save", async function (next) {
  //hashing admin password
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password as string,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const Admin = model<IAdmin, AdminModel>("Admin", AdminSchema);
