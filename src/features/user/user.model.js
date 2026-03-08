import { Schema, model } from "mongoose";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
      default: "customer",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    banned: {
      type: Boolean,
      default: false,
      select: false,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: true }
);

export const User = model("User", UserSchema);
