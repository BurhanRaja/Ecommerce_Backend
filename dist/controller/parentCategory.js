var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ParentCategory from "../model/Parentcategory.js";
import validateReq from "../utils/vaidation.js";
// Get Parent Categories
export const getAllParentCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const pCategories = yield ParentCategory.find();
        if (!pCategories) {
            res.status(404).send({ success, error: "404 Not Found" });
        }
        success = true;
        return res.status(200).send({
            success,
            pCategories,
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            error: "Internal Server Error",
        });
    }
});
export const getSingleParentCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const pCategory = yield ParentCategory.findOne({ _id: req.params.id });
        if (!pCategory) {
            res.status(404).send({ success, error: "404 Not Found" });
        }
        success = true;
        return res.status(200).send({
            success,
            pCategory,
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            error: "Internal Server Error",
        });
    }
});
// Create Parent Category
export const createParentCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, description } = req.body;
        let pCategory = yield ParentCategory.findOne({ name: name });
        if (pCategory) {
            return res.status(400).send({
                success,
                message: "Parent Category Already exists.",
            });
        }
        pCategory = yield ParentCategory.create({
            name,
            description,
        });
        success = true;
        return res.status(200).send({
            success,
            pCategory,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Update Parent Category
export const updateParentCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, description } = req.body;
        let updCat = {};
        if (name)
            updCat.name = name;
        if (description)
            updCat.description = description;
        let pCategory = yield ParentCategory.findById(req.params.id);
        if (!pCategory) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        pCategory = yield ParentCategory.findByIdAndUpdate(req.params.id, { $set: updCat }, { new: true });
        success = true;
        return res.status(200).send({
            success,
            pCategory,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Delete Parent Category
export const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let pCategory = yield ParentCategory.findById(req.params.id);
        if (!pCategory) {
            return res.status(404).send({
                success,
                message: "404 Not Found",
            });
        }
        pCategory = yield ParentCategory.findOneAndDelete({ _id: req.params.id }, {
            $set: null,
        });
        success = true;
        return res.status(200).send({
            success,
            pCategory,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
