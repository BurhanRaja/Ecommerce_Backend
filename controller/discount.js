const Discount = require("../model/Discount");
const Product = require("../model/Product");
const { validateReq } = require("../utils/vaidation");

// Get all Discounts
exports.getAllDiscounts = async (req, res, next) => {
  let success = false;
  try {
    let discounts = await Discount.find({ seller_id: req.seller.id });

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
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

// Add Discount
exports.addDiscount = async (req, res, next) => {
  let success = false;
  validateReq(req, res);
  try {
    const { description, discount_percentage, is_active } = req.body;

    let discount = await Discount.findOne({ discount_percentage });

    if (discount) {
      return res
        .status(400)
        .send({ success, message: "Discount Already present." });
    }

    discount = await Discount.create({
      description,
      discount_percentage,
      is_active,
      seller_id: req.seller.id,
    });

    success = true;

    return res.status(200).send({
      success,
      discount,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Update Discounts
exports.updateDiscount = async (req, res, next) => {
  let success = false;
  validateReq(req, res);
  try {
    const { description, discount_percentage, is_active, products } = req.body;

    let discount = await Discount.findOne({ id: req.params.id });
    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let updDiscount = {};

    if (description) updDiscount.description = description;
    if (discount_percentage)
      updDiscount.discount_percentage = discount_percentage;
    if (is_active) updDiscount.is_active = is_active;
    if (products) updDiscount.products = products;

    discount = await Discount.findOneAndUpdate(
      { id: req.params.id },
      { $set: updDiscount }
    );

    success = true;
    return res.status(200).send({
      success,
      discount,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Delete Discounts
exports.deleteDiscount = async (req, res, next) => {
  let success = false;

  try {
    let discount = await Discount.findOne({ id: req.params.id });

    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let product = await Product.updateMany(
      { discount: req.params.id },
      { $unset: { discount: "" } }
    );

    discount = await Discount.findOneAndDelete({ id: req.params.id });

    success = true;
    return res.status(200).send({
      success,
      discount,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Add and Update Product to Discount
exports.productstoDiscount = async (req, res, next) => {
  let success = false;

  try {
    const { products } = req.body;

    let discount = await Discount.findOne({ id: req.params.id, seller_id: req.seller.id });

    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    discount = await Discount.findOneAndUpdate(
      { id: req.params.id, seller_id: req.seller.id },
      { $set: { products } }
    );


    let product = await Product.updateMany(
      { discount: discount._id, seller_id: req.seller.id },
      { $unset: { discount: "" } }
    );

    product = await Product.updateMany(
      { _id: { $in: products }, seller_id: req.seller.id },
      { $set: { discount: discount._id } }
    );

    success = true;

    return res.status(200).send({
      success,
      discount,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Get Single Discount
exports.getDiscount = async (req, res, next) => {
  let success = false;

  try {
    let discount = await Discount.findOne({
      id: req.params.id,
      seller_id: req.seller.id,
    });
    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    discount = await Discount.findOne({ id: req.params.id }).populate({
      path: "products",
      model: "Product",
    });

    success = true;

    return res.status(200).send({
      success,
      discount,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};
