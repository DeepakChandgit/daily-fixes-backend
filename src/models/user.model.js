import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
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
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minLength: [10, "Phone number must be exactly 10 digits"],
      maxLength: [10, "Phone number must be exactly 10 digits"],
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
      default: "customer",
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    banned: {
      type: Boolean,
      default: false,
      select: false,
    },
    avatar: {
      publicId: {
        type: String,
      },
      resource: {
        type: String,
        default: "image",
      },
      url: {
        type: String,
      },
    },
    forgotPasswordOTP: {
      value: {
        type: String,
      },
      generationTime: {
        type: Date,
      },
    },
  },
  { strict: true, timestamps: true }
);

// If password is modified this hook will run every time before saving and hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// this method takes the user entered password and compares it with the hashed password and return Boolean value
userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return token;
};

export const User = model("User", userSchema);
