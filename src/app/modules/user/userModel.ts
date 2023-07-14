import { Model, Schema, Types, model } from "mongoose";
import { IUser, UserModel } from "./userInterface";
import bcrypt from "bcrypt";
import config from "../../../config";
import { userRoles } from "./userConstant";

const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, unique: true, required: true },
    role: { type: String, enum: userRoles, required: true },
    password: { type: String, required: true },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },

    address: { type: String, required: true },
    budget: { type: Number },
    income: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//  User Exist instance methods
userSchema.methods.isUserExistByPhone = async function (
  phoneNumber: string
): Promise<Pick<IUser, "password" | "role" | "phoneNumber" | "_id"> | null> {
  return await User.findOne(
    { phoneNumber },
    { phoneNumber: 1, password: 1, role: 1, _id: 1 }
  );
};

userSchema.methods.isUserExist = async function (
  id: Types.ObjectId
): Promise<Pick<IUser, "password" | "role" | "phoneNumber" | "_id"> | null> {
  return await User.findOne(
    { _id: id },
    { phoneNumber: 1, password: 1, role: 1, _id: 1 }
  );
};

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre("save", async function (next) {
  //hashing user password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const User = model<IUser, UserModel>("User", userSchema);
