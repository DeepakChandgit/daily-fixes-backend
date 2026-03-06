import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "Service name is required (e.g., 'Deep Cleaning', 'Pipe Repair')",
      ],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service must belong to a category"],
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Service must be linked to a provider"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base pricing must be displayed before confirmation"],
      min: [0, "Price cannot be negative"],
    },
  },
  { timestamps: true }
);

// Compound index to quickly find specific services offered by a specific provider
serviceSchema.index({ categoryId: 1, providerId: 1 });

export const Service = model("Service", serviceSchema);
