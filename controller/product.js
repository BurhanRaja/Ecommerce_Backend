const { validateReq } = require("../utils/vaidation");
const Product = require("../model/Product");

// Admin Side
exports.getProduct = async (req, res, next) => {
  let success = false;
  try {
    const products = Product.find({ seller_id: req.seller.id });
    success = true;
    return res.status(200).send({
      success,
      products,
    });
  } catch (err) {
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
      images,
      description,
      custom_information,
      price,
      colors,
      sizes,
      info_type,
      quantity,
      category_id,
      sub_category_id,
      parent_category_id,
    } = req.body;

    const product = await Product.create({
      name,
      images,
      description,
      custom_information,
      price,
      colors,
      sizes,
      info_type,
      quantity,
      seller_id: req.seller.id,
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
      images,
      description,
      custom_information,
      price,
      colors,
      sizes,
      info_type,
      quantity,
      category_id,
      sub_category_id,
      parent_category_id,
    } = req.body;

    const updProd = {};

    if (name) updProd.name = name;
    if (images) updProd.images = images;
    if (description) updProd.description = description;
    if (custom_information) updProd.custom_information = custom_information;
    if (price) updProd.price = price;
    if (colors) updProd.colors = colors;
    if (sizes) updProd.sizes = sizes;
    if (info_type) updProd.info_type = info_type;
    if (quantity) updProd.quantity = quantity;
    if (category_id) updProd.category_id = category_id;
    if (sub_category_id) updProd.sub_category_id = sub_category_id;
    if (parent_category_id) updProd.parent_category_id = parent_category_id;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("404 Not Found");
    }

    if (product.seller_id.toString() !== req.seller.id) {
      return res.status(401).send("Unauthorized Access!");
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updProd },
      { new: true }
    );
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

// Client Side

// Get All Products Based on Filters
exports.getAllProducts = async (req, res, next) => {
  let success = false;
  try {
    let filters = req.query;
    let updFilters = {};
    let price_range = [];

    if (filters.seller) {
      updFilters.seller_id = { $in: filters.seller.split(",") };
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
      price_range = filters.price_range.split(",");
      updFilters.price = {
        $lte: Number(price_range[0]) || 1000000,
        $gte: Number(price_range[1]) || 0,
      };
    }
    if (filters.rating) {
      updFilters["review.ratings"] = { $lte: Number(filters.rating) };
    }

    let products = await Product.find(updFilters).populate({
      path: "dicount",
      model: "Dicount",
    });

    if (!products) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    success = true;

    return res.status(200).send({
      success,
      products,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

// Add Rating Only for authenticated user
exports.addRating = async (req, res ,next) => {
  let success = false;
  try {

    let rating = Product.findOne({
      _id: req.params.id,
      rating: {user_id: req.user.id}
    });

    if (rating) {
      return res.status(400).send({success, message: "Rating already added."});
    }

    rating = Product.findOne({});

    success = true;

    return res.status(200).send({
      success,
      rating
    });

  } catch (err) {
    
  }
}


// For All
exports.singleProduct = async (req, res, next) => {
  let success = false;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    product = await Product.findById(req.params.id)
      .populate({
        path: "discount",
        model: "Discount",
      })
      .populate({
        path: "seller_id",
        model: "Seller",
      })
      .exec();

    success = true;

    return res.status(200).send({
      success,
      product,
    });
  } catch (err) {
    return res
      .status(200)
      .send({ success: false, error: "Internal Server Error" });
  }
};
