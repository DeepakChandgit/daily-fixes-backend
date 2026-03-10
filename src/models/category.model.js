import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category already exits"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
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
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
