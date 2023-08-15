import mongoose, { Schema } from "mongoose";
import Useraddress from "./Useraddress.js";
import { IUser } from "../utils/defineModels.js";

const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.post("findOneAndDelete", async function (user, next) {
  await Useraddress.deleteOne({ user_id: user._id });
  next();
});

export default mongoose.model("User", UserSchema);
