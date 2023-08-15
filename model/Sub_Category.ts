import mongoose, { Schema } from "mongoose";
import { ISubCategory } from "../utils/defineModels.js";
import Product from "./Product.js";

const SubCategorySchema = new Schema<ISubCategory>(
  {
    name: String,
    description: String,
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Parentcategory",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SubCategorySchema.post("findOneAndDelete", async function (subcategory, next) {
  await Product.deleteMany({ sub_category_id: subcategory._id });
  next();
});

export default mongoose.model("Subcategory", SubCategorySchema);
