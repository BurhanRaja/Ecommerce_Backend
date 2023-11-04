var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import validateReq from "../utils/vaidation.js";
import Product from "../model/Product.js";
import mongoose from "mongoose";
// Admin Side ----------------------------------------------------------------------------
export const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const products = yield Product.aggregate([
            {
                $match: {
                    seller_id: new mongoose.Types.ObjectId(req.seller.id),
                },
            },
            {
                $lookup: {
                    from: "parentcategories",
                    localField: "parent_category_id",
                    foreignField: "_id",
                    as: "parent_category",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "sub_category_id",
                    foreignField: "_id",
                    as: "sub_category",
                },
            },
            {
                $lookup: {
                    from: "discounts",
                    localField: "discount",
                    foreignField: "_id",
                    as: "discount",
                },
            },
            {
                $project: {
                    name: 1,
                    thumbnail: 1,
                    parent_category: { $first: "$parent_category" },
                    category: { $first: "$category" },
                    sub_category: { $first: "$sub_category" },
                    discount: { $first: "$discount" },
                    price_avg: { $avg: "$images_info.price" },
                    price_min: { $min: "$images_info.price" },
                    price_max: { $max: "$images_info.price" },
                    sizes: {
                        $reduce: {
                            input: "$images_info",
                            initialValue: [],
                            in: {
                                $setUnion: ["$$value", "$$this.sizes"],
                            },
                        },
                    },
                    info_types: {
                        $reduce: {
                            input: "$images_info",
                            initialValue: [],
                            in: {
                                $setUnion: ["$$value", "$$this.info_types"],
                            },
                        },
                    },
                    colors: { $concatArrays: "$images_info.color" },
                    quantity: { $sum: "$images_info.quantity" },
                },
            },
        ]);
        success = true;
        return res.status(200).send({
            success,
            products,
        });
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Create Product
export const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq;
    try {
        const { name, images_info, thumbnail, description, category_id, sub_category_id, parent_category_id, } = req.body;
        let product;
        if (sub_category_id) {
            product = yield Product.create({
                name,
                images_info,
                thumbnail,
                description,
                seller_id: req.seller.id,
                seller_info: req.seller.sellerinfo.id,
                category_id,
                sub_category_id,
                parent_category_id,
            });
        }
        else {
            product = yield Product.create({
                name,
                images_info,
                thumbnail,
                description,
                seller_id: req.seller.id,
                seller_info: req.seller.sellerinfo.id,
                category_id,
                parent_category_id,
            });
        }
        success = true;
        return res.status(200).send({
            success,
            product,
        });
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Update Product
export const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { name, images_info, description, thumbnail, category_id, sub_category_id, parent_category_id, } = req.body;
        const updProd = {};
        if (name)
            updProd.name = name;
        if (images_info)
            updProd.images_info = images_info;
        if (description)
            updProd.description = description;
        if (thumbnail)
            updProd.thumbnail = thumbnail;
        if (category_id)
            updProd.category_id = category_id;
        if (sub_category_id)
            updProd.sub_category_id = sub_category_id;
        if (parent_category_id)
            updProd.parent_category_id = parent_category_id;
        let product = yield Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("404 Not Found");
        }
        product = yield Product.findByIdAndUpdate(req.params.id, { $set: updProd });
        success = true;
        return res.status(200).send({
            success,
            product,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Delete Product
export const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let product = yield Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ success, error: "404 Not Found" });
        }
        if (product.seller_id.toString() !== req.seller.id) {
            return res.status(401).send("Unauthorized Access!");
        }
        product = yield Product.findOneAndDelete({ _id: req.params.id }, { $set: null });
        success = true;
        return res.status(200).send({
            success,
            product,
        });
    }
    catch (error) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
// Client Side ---------------------------------------------------------------------------
// Add Rating Only for authenticated user
export const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { content, ratings } = req.body;
        let reviews = yield Product.findOne({
            _id: req.params.id,
        }, {
            reviews: { $elemMatch: { user_id: req.user.id } },
        });
        if (reviews && reviews.reviews.length > 0) {
            return res
                .status(400)
                .send({ success, message: "Rating already added." });
        }
        reviews = yield Product.findOneAndUpdate({ _id: req.params.id }, {
            $push: {
                reviews: [
                    {
                        content,
                        ratings,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        user_id: req.user.id,
                    },
                ],
            },
        });
        success = true;
        return res.status(200).send({
            success,
            reviews,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Update Review
export const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { content, ratings } = req.body;
        let reviews = yield Product.findOne({
            id: req.params.id,
        });
        if (!reviews) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        reviews = yield Product.findOneAndUpdate({
            id: req.params.id,
            "reviews.user_id": req.user.id,
        }, {
            $set: {
                "reviews.content": content,
                "reviews.ratings": ratings,
                "reviews.updated_at": new Date().toISOString(),
            },
        });
        success = true;
        return res.status(200).send({
            success,
            reviews,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// Delete Review
export const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let reviews = yield Product.findOne({
            id: req.params.id,
        });
        if (!reviews) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        reviews = yield Product.findOneAndUpdate({
            id: req.params.id,
        }, { $pull: { reviews: { _id: req.params.reviewid } } });
        success = true;
        return res.status(200).send({
            success,
            reviews,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// For All ---------------------------------------------------------------
// Get All Products Based on Filters
export const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let filters = req.query;
        let updFilters = {};
        let price_range = [];
        let gte = 0;
        let lte = 100000000000000;
        let rating = 5;
        if (filters.company) {
            updFilters["seller_info"] = {
                $in: filters.company.split(","),
            };
        }
        if (filters.parentcategory) {
            updFilters["parent_category_id"] = filters.parentcategory;
        }
        if (filters.category) {
            updFilters["category_id"] = {
                $in: filters.category.split(","),
            };
        }
        if (filters.subcategory) {
            updFilters["sub_category_id"] = {
                $in: filters.subcategory.split(","),
            };
        }
        if (filters.price) {
            price_range = filters.price.split(",");
            gte = parseInt(price_range[0]);
            lte = parseInt(price_range[1]);
        }
        if (filters.rating) {
            rating = Number(filters.rating);
        }
        let products = yield Product.find(Object.assign(Object.assign({}, updFilters), { "images_info.price": {
                $gte: gte,
                $lte: lte,
            }, "reviews.ratings": { $lte: Number(rating) } })).populate("discount");
        if (!products) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        if (filters.discount) {
            products = products.filter((el) => el.discount
                ? el.discount.discount_percentage > Number(filters.discount)
                : {});
        }
        success = true;
        return res.status(200).send({
            success,
            products,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
export const singleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let success = false;
    try {
        const diffproduct = yield Product.findById(req.params.id);
        if (!diffproduct) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let product = yield Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "parentcategories",
                    localField: "parent_category_id",
                    foreignField: "_id",
                    as: "parent_category",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "sub_category_id",
                    foreignField: "_id",
                    as: "sub_category",
                },
            },
            {
                $lookup: {
                    from: "discounts",
                    localField: "discount",
                    foreignField: "_id",
                    as: "discount",
                },
            },
            {
                $lookup: {
                    from: "sellerinfos",
                    localField: "seller_info",
                    foreignField: "_id",
                    as: "sellerinfo",
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    thumbnail: 1,
                    price_avg: { $avg: "$images_info.price" },
                    price_min: { $min: "$images_info.price" },
                    price_max: { $max: "$images_info.price" },
                    images_info: 1,
                    parent_category: { $first: "$parent_category" },
                    category: { $first: "$category" },
                    sub_category: { $first: "$sub_category" },
                    discount: { $first: "$discount" },
                    sellerinfo: { $first: "$sellerinfo" },
                    reviewsavg: { $avg: "$reviews.ratings" },
                    sizes: {
                        $reduce: {
                            input: "$images_info",
                            initialValue: [],
                            in: {
                                $setUnion: ["$$value", "$$this.sizes"],
                            },
                        },
                    },
                    info_types: {
                        $reduce: {
                            input: "$images_info",
                            initialValue: [],
                            in: {
                                $setUnion: ["$$value", "$$this.info_types"],
                            },
                        },
                    },
                    colors: { $concatArrays: "$images_info.color" },
                    quantity: { $sum: "$images_info.quantity" },
                    seller_id: 1,
                },
            },
        ]);
        let allReviews = yield Product.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $unwind: "$reviews",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reviews.user_id",
                    foreignField: "_id",
                    as: "reviews.user",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    allReviews: {
                        $push: "$reviews",
                    },
                },
            },
            {
                $project: {
                    reviews: "$allReviews",
                },
            },
        ]);
        success = true;
        const all = Object.assign(Object.assign({}, product[0]), { reviews: (_a = allReviews[0]) === null || _a === void 0 ? void 0 : _a.reviews });
        return res.status(200).send({
            success,
            product: all,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
export const getImageInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { color } = req.query;
        let product = yield Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        let updFilter = {};
        if (color)
            updFilter.color = color;
        updFilter._id = req.params.itemId;
        let newFilter = {};
        newFilter["$elemMatch"] = updFilter;
        let imageInfo = yield Product.findOne({
            id: req.params.id,
            images_info: Object.assign({}, newFilter),
        }, {
            "images_info.$": 1,
        });
        success = true;
        return res.status(200).send({
            success,
            imageInfo,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
export const getTrendingProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true;
    try {
        let trendingProducts = yield Product.find({
            "reviews.ratings": { $gte: 4 },
        });
        success = true;
        return res.status(200).send({
            success: true,
            products: trendingProducts,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
export const getSellerProductCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let product = yield Product.find({
            seller_id: req.seller.id,
        }).count();
        success = true;
        return res.status(200).send({
            success,
            productcount: product,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error" });
    }
});
