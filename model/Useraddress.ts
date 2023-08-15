import mongoose, { Schema } from "mongoose";
import { IUserAddress } from "../utils/defineModels.js";

const UserAddressSchema = new Schema<IUserAddress>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    addresses: {
      type: [
        {
          address_line_1: {
            type: String,
            required: true,
          },
          address_line_2: {
            type: String,
          },
          city: {
            type: String,
            required: true,
          },
          state: {
            type: String,
            required: true,
          },
          postal_code: {
            type: Number,
            required: true,
          },
          country: {
            type: String,
            required: true,
          },
          address_type: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User_Address", UserAddressSchema);
