import { Model, Schema, Types } from "mongoose";
import { IUser } from "../user/userInterface";

export type ICow = {
  name: string;
  age: number;
  price: number;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymensingh";
  breed:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar"
    | "Kankrej";
  weight: number;
  label: "for sale" | "sold out";
  category?: "Dairy" | "Beef" | "Dual Purpose";
  seller: Types.ObjectId | IUser; // Assuming seller ID is a string
};

export type ICowFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type CowModel = Model<ICow, Record<string, unknown>>;
