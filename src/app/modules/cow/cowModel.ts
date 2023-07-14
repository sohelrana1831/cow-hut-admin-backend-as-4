import mongoose, { Schema, model } from "mongoose";
import { CowModel, ICow } from "./cowInterface";

const cowSchema = new Schema<ICow>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: {
      type: String,
      enum: [
        "Dhaka",
        "Chattogram",
        "Barishal",
        "Rajshahi",
        "Sylhet",
        "Comilla",
        "Rangpur",
        "Mymensingh",
      ],
      required: true,
    },
    breed: {
      type: String,
      enum: [
        "Brahman",
        "Nellore",
        "Sahiwal",
        "Gir",
        "Indigenous",
        "Tharparkar",
        "Kankrej",
      ],
      required: true,
    },
    weight: { type: Number, required: true },
    label: {
      type: String,
      enum: ["for sale", "sold out"],
      default: "for sale",
    },
    category: { type: String, enum: ["Dairy", "Beef", "Dual Purpose"] },
    seller: {
      type: Schema.Types.ObjectId, // academicSemester --> _id
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
