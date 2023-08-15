import mongoose, { Schema } from "mongoose";
import Sellerinfo from "./Sellerinfo.js";
import { ISeller } from "../utils/defineModels.js";

const SellerSchema = new Schema<ISeller>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SellerSchema.post("findOneAndDelete", async function (seller, next) {
  await Sellerinfo.deleteOne({ seller_id: seller._id });
  next();
});

export default mongoose.model("Seller", SellerSchema);
