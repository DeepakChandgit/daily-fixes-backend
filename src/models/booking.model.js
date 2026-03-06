import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking requires a customer ID"],
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Booking requires a provider ID"],
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Booking requires a specific service ID"],
    },
    status: {
      type: String,
      enum: {
        values: [
          "Requested",
          "Confirmed",
          "In-progress",
          "Completed",
          "Cancelled",
        ],
        message: "{VALUE} is not a valid booking status",
      },
      default: "Requested",
      index: true,
    },
    serviceDate: {
      type: Date,
      required: [true, "A date must be selected for the booking"],
    },
    serviceAddress: {
      type: String,
      required: [true, "Service address is required"],
    },
    customerNotes: {
      type: String,
    },
    providerWorkNotes: {
      type: String,
    },
    pricing: {
      agreedPrice: {
        type: Number,
        required: [true, "Agreed price is required for the transaction"],
      },
    },
    images: {
      before: [
        {
          publicId: String,
          url: String,
        },
      ],
      after: [
        {
          publicId: String,
          url: String,
        },
      ],
    },
  },
  { timestamps: true }
);

// Compound index for a Provider looking at their schedule
bookingSchema.index({ providerId: 1, status: 1, serviceDate: 1 });

export const Booking = model("Booking", bookingSchema);
