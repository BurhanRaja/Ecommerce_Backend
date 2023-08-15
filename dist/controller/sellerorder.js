var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Sellerorder from "../model/Sellerorder.js";
import Useraddress from "../model/Useraddress.js";
export const getAllSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let sellerOrders = yield Sellerorder.findOne({
            seller: req.seller.id,
        })
            .populate({
            path: "products.item",
            populate: {
                path: "product",
                model: "Product",
            },
        })
            .populate("products.user");
        if (!sellerOrders) {
            return res.status(404).send({
                success: false,
                message: "404 Not Found.",
            });
        }
        success = true;
        return res.status(200).send({
            success,
            sellerOrders,
        });
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error.",
        });
    }
});
export const getSingleSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let sellerOrder = yield Sellerorder.findOne({
            seller: req.seller.id,
            "products._id": req.params.id,
        }, { products: { $elemMatch: { _id: req.params.id } } })
            .populate({
            path: "products.item",
            populate: {
                path: "product",
                model: "Product",
            },
        })
            .populate("products.user");
        if (!sellerOrder) {
            return res.status(404).send({
                success: false,
                message: "404 not found",
            });
        }
        let productAddressId = sellerOrder.products[0].address;
        let userId = sellerOrder.products[0].user._id;
        let address = yield Useraddress.findOne({
            user_id: userId,
            "addresses._id": productAddressId,
        }, { addresses: { $elemMatch: { _id: productAddressId } } });
        success = true;
        return res.status(200).send({
            success,
            orderdetails: {
                _id: sellerOrder._id,
                product: sellerOrder.products[0].item,
                user: sellerOrder.products[0].user,
                address: address ? address.addresses[0] : {},
            },
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error.",
        });
    }
});
export const getSellerOrderCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let sellerOrder = yield Sellerorder.findOne({ seller: req.seller.id });
        if (!sellerOrder) {
            return res.status(404).send({
                success,
                message: "404 not found.",
            });
        }
        let count = sellerOrder.products.length;
        success = true;
        return res.status(200).send({
            success,
            sellerordercount: count,
        });
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error.",
        });
    }
});
