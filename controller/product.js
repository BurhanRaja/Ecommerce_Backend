const { validateReq } = require("../utils/vaidation");
const Product = require("../model/Product");
const mongoose = require("mongoose");

// Admin Side ----------------------------------------------------------------------------
exports.getProducts = async (req, res, next) => {
  let success = false;
  try {
    const products = await Product.aggregate([
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
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Create Product
exports.createProduct = async (req, res, next) => {
  let success = false;

  validateReq;

  try {
    const {
      name,
      images_info,
      thumbnail,
      description,
      category_id,
      sub_category_id,
      parent_category_id,
    } = req.body;

    const product = await Product.create({
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

    success = true;

    return res.status(200).send({
      success,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      name,
      images_info,
      description,
      thumbnail,
      category_id,
      sub_category_id,
      parent_category_id,
    } = req.body;

    const updProd = {};

    if (name) updProd.name = name;
    if (images_info) updProd.images_info = images_info;
    if (description) updProd.description = description;
    if (thumbnail) updProd.thumbnail = thumbnail;
    if (category_id) updProd.category_id = category_id;
    if (sub_category_id) updProd.sub_category_id = sub_category_id;
    if (parent_category_id) updProd.parent_category_id = parent_category_id;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("404 Not Found");
    }

    product = await Product.findByIdAndUpdate(req.params.id, { $set: updProd });
    success = true;

    return res.status(200).send({
      success,
      product,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  let success = false;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ success, error: "404 Not Found" });
    }

    if (product.seller_id.toString() !== req.seller.id) {
      return res.status(401).send("Unauthorized Access!");
    }

    product = await Product.findOneAndDelete(req.params.id, { $set: null });
    success = true;

    return res.status(200).send({
      success,
      product,
    });
  } catch (error) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Client Side ---------------------------------------------------------------------------

// Add Rating Only for authenticated user
exports.addReview = async (req, res, next) => {
  let success = false;
  try {
    const { content, ratings } = req.body;

    let reviews = await Product.findOne({
      id: req.params.id,
      reviews: { user_id: req.user.id },
    });

    if (reviews) {
      return res
        .status(400)
        .send({ success, message: "Rating already added." });
    }

    reviews = await Product.findOneAndUpdate(
      { id: req.params.id },
      {
        $push: {
          reviews: {
            content,
            ratings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: req.user.id,
          },
        },
      }
    );

    success = true;

    return res.status(200).send({
      success,
      reviews,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Update Review
exports.updateReview = async (req, res, next) => {
  let success = false;
  try {
    const { content, ratings } = req.body;

    let reviews = await Product.findOne({
      id: req.params.id,
    });

    if (!reviews) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    reviews = await Product.findOneAndUpdate(
      {
        id: req.params.id,
        "reviews.user_id": req.user.id,
      },
      {
        $set: {
          "reviews.content": content,
          "reviews.ratings": ratings,
          "reviews.updated_at": new Date().toISOString(),
        },
      }
    );

    success = true;
    return res.status(200).send({
      success,
      reviews,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Delete Review
exports.deleteReview = async (req, res, next) => {
  let success = false;
  try {
    let reviews = await Product.findOne({
      id: req.params.id,
    });

    if (!reviews) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    reviews = await Product.findOneAndUpdate(
      {
        id: req.params.id,
      },
      { $pull: { reviews: { _id: req.params.reviewid } } }
    );

    success = true;

    return res.status(200).send({
      success,
      reviews,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// For All ---------------------------------------------------------------
// Get All Products Based on Filters
exports.getAllProducts = async (req, res, next) => {
  let success = false;
  try {
    let filters = req.query;
    let updFilters = {};
    let price_range = [];

    if (filters.company) {
      updFilters.seller_info = { $in: filters.company.split(",") };
    }
    if (filters.parentcategory) {
      updFilters.parent_category_id = filters.parentcategory;
    }
    if (filters.category) {
      updFilters.category_id = { $in: filters.category.split(",") };
    }
    if (filters.subcategory) {
      updFilters.sub_category_id = { $in: filters.subcategory.split(",") };
    }
    if (filters.price) {
      price_range = filters.price.split(",");
      updFilters.images_info.price = {
        $gte: Number(price_range[0]) || 0,
        $lte: Number(price_range[1]) || 1000000,
      };
    }
    if (filters.rating) {
      updFilters["review.ratings"] = { $lte: Number(filters.rating) };
    }

    let products = await Product.aggregate([
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
          description: 1,
          thumbnail: 1,
          price: { $min: "$images_info.price" },
          discount: { $first: "$discount" },
        },
      },
    ]);

    if (filters.discount) {
      products = products.filter(
        (el) => el.discount.discount_percentage > Number(filters.discount)
      );
    }

    if (!products) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    success = true;

    return res.status(200).send({
      success,
      products,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

exports.singleProduct = async (req, res, next) => {
  let success = false;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    product = await Product.aggregate([
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
          reviews: { $avg: "$reviews.ratings" },
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
      product,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

exports.getImageInfo = async (req, res, next) => {
  let success = false;
  try {
    const filters = req.query;

    let product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let updFilter = {};

    if (filters.color) updFilter.color = filters.color;
    updFilter._id = req.params.itemId;

    let newFilter = {};
    newFilter["$elemMatch"] = updFilter;

    let imageInfo = await Product.findOne(
      { id: req.params.id, images_info: newFilter },
      {
        "images_info.$": 1,
      }
    );

    success = true;

    return res.status(200).send({
      success,
      imageInfo,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  let success = true;
  try {
    let trendingProducts = await Product.find({
      "reviews.ratings": { $gte: 4 },
    });

    success = true;

    return res.status(200).send({
      success: true,
      products: trendingProducts,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};
