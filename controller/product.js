const { validationResult } = require("express-validator");
const Product = require("../model/Product");

// Get Products from a seller
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
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ error: error.array() });
  }

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
      category_id
    } = req.body;

    console.log(req.headers);

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
      category_id
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
