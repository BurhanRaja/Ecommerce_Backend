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
import Product from "./Product.js";
const SubCategorySchema = new Schema({
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
}, {
    timestamps: true,
});
SubCategorySchema.post("findOneAndDelete", function (subcategory, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Product.deleteMany({ sub_category_id: subcategory._id });
        next();
    });
});
export default mongoose.model("Subcategory", SubCategorySchema);
