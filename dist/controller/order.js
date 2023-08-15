var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cart from "../model/Cart.js";
import Cartitem from "../model/Cartitem.js";
import Order from "../model/Order.js";
import Sellerorder from "../model/Sellerorder.js";
import mongoose from "mongoose";
import Useraddress from "../model/Useraddress.js";
// Filter all the products based on seller_id
// To send the filtered order for seller
// Get All Order
export const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let orders = yield Order.find({ user: req.user.id });
        if (!orders) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        success = true;
        return res.status(200).send({
            success,
            orders,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Get Single Order
export const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let order = yield Order.findOne({
            id: req.params.id,
            user_id: req.user.id,
        }).populate({
            path: "cart",
            populate: {
                path: "cartItems",
                populate: {
                    path: "product",
                    model: "Product",
                },
                model: "Cartitem",
            },
        });
        if (!order) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let address = yield Useraddress.findOne({
            user_id: req.user.id,
            "addresses._id": order.address,
        }, { addresses: { $elemMatch: { _id: order.address } } });
        if (!address) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        success = true;
        return res.status(200).send({
            success,
            order: {
                _id: order._id,
                cart: order.cart,
                address: address.addresses[0],
                total: order.total,
                date: order,
            },
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Create Order
export const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { cart_id, address_id, payment_type, payment_status, is_delivered, total, } = req.body;
        let order = yield Order.create({
            user: req.user.id,
            cart: cart_id,
            address: address_id,
            payment_type,
            payment_status,
            is_delivered,
            total,
        });
        let cart = yield Cart.findOneAndUpdate({ id: cart_id, is_active: true }, { $set: { is_active: false } });
        if (!cart) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        let cartItems = yield Cartitem.find({ _id: { $in: cart.cartItems } });
        for (let i = 0; i < cartItems.length; i++) {
            yield addSeller(cartItems[i].seller, cartItems[i]._id, address_id, req.user.id);
        }
        success = true;
        return res.status(200).send({
            success,
            order,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
const addSeller = (sellerid, cartItem, addressid, userid) => __awaiter(void 0, void 0, void 0, function* () {
    let sellerOrder = yield Sellerorder.findOne({ seller: sellerid.toString() });
    if (!sellerOrder) {
        sellerOrder = yield Sellerorder.create({
            seller: sellerid.toString(),
            products: [
                {
                    item: cartItem,
                    user: userid,
                    address: addressid,
                    ispayed: false,
                },
            ],
        });
    }
    else {
        sellerOrder = yield Sellerorder.findOneAndUpdate({ seller: sellerid.toString() }, {
            $push: {
                products: {
                    item: cartItem,
                    user: userid,
                    address: addressid,
                    ispayed: false,
                },
            },
        });
    }
});
// Get All order based on sellerid
export const getSellerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let sellerOrder = yield Sellerorder.aggregate([])
            .match({
            seller: new mongoose.Types.ObjectId(req.seller.id),
        })
            .lookup({
            from: "cartitems",
            localField: "products.item",
            foreignField: "_id",
            as: "productItems",
        })
            .lookup({
            from: "users",
            localField: "products.user",
            foreignField: "_id",
            as: "user_info",
        })
            .lookup({
            from: "user_addresses",
            localField: "products.address",
            foreignField: "addresses._id",
            as: "user_address",
        })
            .project({
            "products.item": "$productItems",
            "products.user": "$user_info",
            "products.address": "$user_address",
        });
        if (!sellerOrder) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        success = true;
        return res.status(200).send({
            success,
            sellerOrder,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
export const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { is_delivered, payment_status } = req.body;
        let order = yield Order.findOne({
            _id: req.params.id,
        });
        if (!order) {
            return res.status(404).send({
                success,
                message: "Order Not Found",
            });
        }
        yield Order.findOneAndUpdate({
            _id: req.params.id,
        }, {
            $set: {
                is_delivered,
                payment_status,
            },
        });
        success = true;
        return res.status(200).send({
            success,
            message: "Order Updated",
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
