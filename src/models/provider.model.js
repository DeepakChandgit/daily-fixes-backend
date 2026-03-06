import { Schema, model } from "mongoose";

const providerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    city: { type: String, trim: true, index: true },
    //GeoJSON format for MongoDB Spatial Queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // MongoDB requires [longitude, latitude] order!
        required: true,
        default: [0, 0],
      },
    },
    bio: {
      type: String,
      required: [true, "Professional profile requires a bio"],
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    stats: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      jobsCompleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

providerSchema.index({ location: "2dsphere" });
export const Provider = model("Provider", providerSchema);
