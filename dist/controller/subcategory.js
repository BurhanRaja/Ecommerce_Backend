var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Types } from "mongoose";
import validateReq from "../utils/vaidation.js";
import Subcategory from "../model/Sub_Category.js";
// Get SubCategory based on category
export const getSubCategoriesofCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let subCategories = yield Subcategory.find({
            category_id: req.params.catid,
        });
        success = true;
        return res.status(200).send({
            success,
            subCategories,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Get SubCategory based on category
export const getAllSubCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let subCategories = yield Subcategory.find();
        success = true;
        return res.status(200).send({
            success,
            subCategories,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Parent categories from Sub categories
export const getAllSubCategoriesfromParent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let { categories } = req.query;
        let params = {};
        params["parent_category_id"] = req.params.id;
        if (categories) {
            params["category_id"] = { $in: categories.split(",") };
        }
        let subcategories = yield Subcategory.find(Object.assign({}, params));
        success = true;
        return res.status(200).send({
            success,
            subcategories,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Create Sub Category
export const createSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true;
    validateReq(req, res);
    try {
        const { name, description, category_id, parent_category_id } = req.body;
        let subCat = yield Subcategory.findOne({
            name: name,
            category_id: category_id,
        });
        if (subCat) {
            return res.status(400).send({
                success: false,
                message: "Sub-category in Category Already Exists.",
            });
        }
        subCat = yield Subcategory.create({
            name,
            description,
            category_id,
            parent_category_id,
        });
        success = true;
        return res.status(200).send({
            success,
            subCat,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Update Sub-category
export const updateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, description, category_id, parent_category_id } = req.body;
        let updSubCat = {};
        if (name)
            updSubCat.name = name;
        if (description)
            updSubCat.description = description;
        if (category_id)
            updSubCat.category_id = new Types.ObjectId(category_id);
        if (parent_category_id)
            updSubCat.parent_category_id = new Types.ObjectId(parent_category_id);
        let subCat = yield Subcategory.findById(req.params.id);
        if (!subCat) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        subCat = yield Subcategory.findByIdAndUpdate(req.params.id, { $set: updSubCat }, { new: true });
        success = true;
        return res.status(200).send({
            success,
            subCat,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Delete Sub-category
export const deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let subCat = yield Subcategory.findById(req.params.id);
        if (!subCat) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        subCat = yield Subcategory.findOneAndDelete({ _id: req.params.id }, { $set: null });
        success = true;
        return res.status(200).send({
            success,
            subCat,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
