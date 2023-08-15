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
import Cart from "../model/Cart.js";
import Cartitem from "../model/Cartitem.js";
import Product from "../model/Product.js";
// Get Current Active Cart
export const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let cart = yield Cart.findOne({
            user_id: req.user.id,
            is_active: true,
        }).populate({
            path: "cartItems",
            populate: {
                path: "product",
                model: Product,
            },
        });
        if (!cart) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        success = true;
        return res.status(200).send({
            success,
            cart,
        });
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Add To Cart
export const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let product = req.body;
        let pDetail = {};
        if (product.price)
            pDetail.price = product.price;
        if (product.sellerid)
            pDetail.seller = product.sellerid;
        if (product.seller_info_id)
            pDetail.seller_info_id = product.seller_info_id;
        if (product.productid)
            pDetail.product = product.productid;
        if (product.quantity)
            pDetail.quantity = Number(product.quantity);
        pDetail.product_info = {};
        if (product.size)
            pDetail.product_info.size = product.size;
        if (product.color)
            pDetail.product_info.color = product.color;
        if (product.info_type)
            pDetail.product_info.info_type = product.info_type;
        if (product.thumbnail)
            pDetail.product_info.thumbnail = product.thumbnail;
        pDetail.is_ordered = false;
        let quant = Number(pDetail.quantity) * -1;
        product = yield Product.findOneAndUpdate({
            _id: pDetail.product,
            "images_info.color": pDetail.product_info.color,
        }, {
            $inc: {
                "images_info.$.quantity": quant,
            },
        });
        let cartItem = yield Cartitem.create(pDetail);
        let cart = yield Cart.findOne({ user_id: req.user.id, is_active: true });
        if (cart) {
            cart = yield Cart.findOneAndUpdate({ user_id: req.user.id, is_active: true }, {
                $push: {
                    cartItems: cartItem.id,
                },
            });
        }
        else {
            cart = yield Cart.create({
                user_id: req.user.id,
                cartItems: [cartItem.id],
                is_active: true,
            });
        }
        success = true;
        return res.status(200).send({
            success,
            cart,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Remove From Cart
export const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let cart = yield Cart.findOne({ id: req.params.id, user_id: req.user.id });
        if (!cart) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let cartItem = yield Cartitem.findOne({ id: req.params.itemid });
        if (!cartItem) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        yield Product.findOneAndUpdate({
            _id: cartItem.product,
            "images_info.color": cartItem.product_info.color,
        }, {
            $inc: {
                "images_info.$.quantity": cartItem.quantity,
            },
        });
        let cartItems = yield Cartitem.findOneAndDelete({ id: req.params.itemid });
        cart = yield Cart.findOneAndUpdate({
            id: req.params.id,
            user_id: req.user.id,
            is_active: true,
        }, {
            $pull: { cartItems: req.params.itemid },
        });
        success = true;
        return res.status(200).send({
            success,
            cart,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// add Total
export const addTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let success = true;
    try {
        let cart = yield Cart.findOne({ user_id: req.user.id, is_active: true });
        if (!cart) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let totalPrice = yield Cart.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(req.user.id),
                    is_active: true,
                },
            },
            {
                $lookup: {
                    from: "cartitems",
                    // let: { cid: "$cartItems" },
                    // pipeline: [{ $match: { $expr: { $in: ["$$", "$$cid"] } } }],
                    localField: "cartItems",
                    foreignField: "_id",
                    as: "newcartItems",
                },
            },
            {
                $project: {
                    _id: 1,
                    total: { $sum: "$newcartItems.price" },
                },
            },
        ]);
        success = true;
        return res.status(200).send({
            success,
            totalPrice: (_a = totalPrice[0]) === null || _a === void 0 ? void 0 : _a.total,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
