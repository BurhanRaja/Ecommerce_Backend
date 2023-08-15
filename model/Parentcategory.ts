import mongoose, { Schema } from "mongoose";
import { IParentCategory } from "../utils/defineModels.js";
import Category from "./Category.js";
import Sub_Category from "./Sub_Category.js";
import Product from "./Product.js";

const ParentCategorySchema = new Schema<IParentCategory>(
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
  },
  {
    timestamps: true,
  }
);

ParentCategorySchema.post(
  "findOneAndDelete",
  async function (parentcategory, next) {
    await Category.deleteMany({ parent_id: parentcategory._id });
    await Sub_Category.deleteMany({ parent_category_id: parentcategory._id });
    await Product.deleteMany({ parent_category_id: parentcategory._id });
    next();
  }
);

export default mongoose.model("ParentCategory", ParentCategorySchema);
