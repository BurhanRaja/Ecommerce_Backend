import mongoose, { Schema } from "mongoose";
import { ICategory } from "../utils/defineModels.js";
import SubCategory from "./Sub_Category.js";
import Product from "./Product.js";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Parentcategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.post("findOneAndDelete", async function (category, next) {
  await SubCategory.deleteMany({ category_id: category._id });
  await Product.deleteMany({ category_id: category._id });
  next();
});

export default mongoose.model("Category", CategorySchema);
