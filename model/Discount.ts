import mongoose, { Schema } from "mongoose";
import { IDiscount } from "../utils/defineModels.js";

const DiscountSchemas = new Schema<IDiscount>(
  {
    description: {
      type: String,
      required: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Discount", DiscountSchemas);
