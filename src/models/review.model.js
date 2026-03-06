import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Review must be directed at a provider"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
      maxlength: [400, "Review cannot exceed 400 characters"],
    },
    isModerated: {
      type: Boolean,
      default: false, // For the Admin "Moderate reviews" requirement
    },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);
