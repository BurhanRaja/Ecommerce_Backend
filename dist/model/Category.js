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
import SubCategory from "./Sub_Category.js";
import Product from "./Product.js";
const CategorySchema = new Schema({
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
}, {
    timestamps: true,
});
CategorySchema.post("findOneAndDelete", function (category, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SubCategory.deleteMany({ category_id: category._id });
        yield Product.deleteMany({ category_id: category._id });
        next();
    });
});
export default mongoose.model("Category", CategorySchema);
