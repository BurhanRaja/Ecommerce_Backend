var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import Discount from "../model/Discount.js";
import Product from "../model/Product.js";
import validateReq from "../utils/vaidation.js";
// Get all Discounts
export const getAllDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let discounts = yield Discount.find({ seller_id: req.seller.id });
        if (!discounts) {
            return res
                .status(404)
                .send({ success, message: "No Discounts Present." });
        }
        success = true;
        return res.status(200).send({
            success,
            discounts,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
// Add Discount
export const addDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { description, discount_percentage, is_active, products } = req.body;
        let discount = yield Discount.findOne({
            discount_percentage,
            seller_id: req.seller.id,
        });
        console.log(discount);
        if (discount) {
            return res
                .status(400)
                .send({ success, message: "Discount Already present." });
        }
        discount = yield Discount.create({
            description,
            discount_percentage,
            is_active,
            seller_id: req.seller.id,
            products,
        });
        yield Product.updateMany({
            _id: { $in: products },
        }, {
            $set: { discount: discount._id },
        });
        success = true;
        return res.status(200).send({
            success,
            discount,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Update Discounts
export const updateDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { description, discount_percentage, is_active, products } = req.body;
        let discount = yield Discount.findOne({ id: req.params.id });
        if (!discount) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let updDiscount = {};
        if (description)
            updDiscount.description = description;
        if (discount_percentage)
            updDiscount.discount_percentage = discount_percentage;
        if (is_active)
            updDiscount.is_active = is_active;
        if (products)
            updDiscount.products = products;
        yield Discount.findOneAndUpdate({ id: req.params.id }, { $set: updDiscount });
        yield Product.updateMany({ discount: discount._id, seller_id: req.seller.id }, { $unset: { discount: "" } });
        yield Product.updateMany({ _id: { $in: products }, seller_id: req.seller.id }, { $set: { discount: discount._id } });
        success = true;
        return res.status(200).send({
            success,
            discount,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Delete Discounts
export const deleteDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let discount = yield Discount.findOne({ id: req.params.id });
        if (!discount) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let product = yield Product.updateMany({ discount: req.params.id }, { $unset: { discount: "" } });
        discount = yield Discount.findOneAndDelete({ id: req.params.id });
        success = true;
        return res.status(200).send({
            success,
            discount,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Add and Update Product to Discount
export const productstoDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { products } = req.body;
        let discount = yield Discount.findOne({
            id: req.params.id,
            seller_id: req.seller.id,
        });
        if (!discount) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        yield Discount.findOneAndUpdate({ id: req.params.id, seller_id: req.seller.id }, { $set: { products } });
        let product = yield Product.updateMany({ discount: discount._id, seller_id: req.seller.id }, { $set: { discount: "" } });
        product = yield Product.updateMany({ _id: { $in: products }, seller_id: req.seller.id }, { $set: { discount: discount._id } });
        success = true;
        return res.status(200).send({
            success,
            discount,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Get Single Discount
export const getDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let discount = yield Discount.findOne({
            id: req.params.id,
            seller_id: req.seller.id,
        });
        if (!discount) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        discount = yield Discount.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "newProducts",
                },
            },
            {
                $project: {
                    _id: 1,
                    description: 1,
                    discount_percentage: 1,
                    products: "$newProducts",
                    is_active: 1,
                    createdAt: 1,
                },
            },
        ]);
        success = true;
        return res.status(200).send({
            success,
            discount: discount ? discount[0] : [],
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
