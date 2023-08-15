import mongoose, { Schema, Types } from "mongoose";
import { ICart } from "../utils/defineModels.js";

const CartSchema = new Schema<ICart>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cartitem",
      required: true,
    },
  ],
  total: {
    type: Number,
  },
  is_active: {
    type: Schema.Types.Boolean,
    required: true,
  },
});

export default mongoose.model("Cart", CartSchema);
