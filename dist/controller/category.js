var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Category from "../model/Category.js";
import validateReq from "../utils/vaidation.js";
// Get All Categories
export const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const categories = yield Category.find();
        if (!categories) {
            res.status(404).send({ success, error: "404 Not Found" });
        }
        success = true;
        return res.status(200).send({
            success,
            categories,
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            error: "Internal Server Error",
        });
    }
});
export const getCategoriesOfParent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const parentId = req.params.parentId;
        const categories = yield Category.find({ parent_id: parentId });
        success = true;
        return res.status(200).send({
            success,
            categories,
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            error: "Internal Server Error",
        });
    }
});
// Create Category
export const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, description, parent_id } = req.body;
        let category = yield Category.findOne({ name: name });
        if (category) {
            return res.status(400).send({
                success,
                message: "Category Already exists.",
            });
        }
        category = yield Category.create({
            name,
            description,
            parent_id,
        });
        success = true;
        return res.status(200).send({
            success,
            category,
        });
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Update Category
export const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, description, parent_id } = req.body;
        let updCat = {};
        if (name)
            updCat.name = name;
        if (description)
            updCat.description = description;
        if (parent_id)
            updCat.parent_id = parent_id;
        let category = yield Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        category = yield Category.findByIdAndUpdate(req.params.id, { $set: updCat }, { new: true });
        success = true;
        return res.status(200).send({
            success,
            category,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Delete Category
export const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let category = yield Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({
                success,
                message: "404 Not Found",
            });
        }
        category = yield Category.findOneAndDelete({ _id: req.params.id }, { $set: null });
        success = true;
        return res.status(200).send({
            success,
            category,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
