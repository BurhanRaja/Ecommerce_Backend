var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose, { Schema } from "mongoose";
import Category from "./Category.js";
import Sub_Category from "./Sub_Category.js";
import Product from "./Product.js";
const ParentCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
ParentCategorySchema.post("findOneAndDelete", function (parentcategory, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Category.deleteMany({ parent_id: parentcategory._id });
        yield Sub_Category.deleteMany({ parent_category_id: parentcategory._id });
        yield Product.deleteMany({ parent_category_id: parentcategory._id });
        next();
    });
});
export default mongoose.model("ParentCategory", ParentCategorySchema);
