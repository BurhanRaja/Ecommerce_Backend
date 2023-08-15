import mongoose from "mongoose";
import Discount from "../model/Discount.js";
import Product from "../model/Product.js";
import validateReq from "../utils/vaidation.js";
import { Request, Response } from "express";
import { SellerAuthRequest } from "../utils/defineauth.js";
import { UpdateDiscount } from "../utils/defineother.js";

// Get all Discounts
export const getAllDiscounts = async (req: SellerAuthRequest, res: Response) => {
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
export const addDiscount = async (req: SellerAuthRequest, res: Response) => {
  let success = false;
  validateReq(req, res);
  try {
    const { description, discount_percentage, is_active, products } = req.body;

    let discount = await Discount.findOne({
      discount_percentage,
      seller_id: req.seller.id,
    });

    console.log(discount);

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
      products,
    });

    await Product.updateMany(
      {
        _id: { $in: products },
      },
      {
        $set: { discount: discount._id },
      }
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

// Update Discounts
export const updateDiscount = async (req: SellerAuthRequest, res: Response) => {
  let success = false;
  validateReq(req, res);
  try {
    const { description, discount_percentage, is_active, products } = req.body;

    let discount = await Discount.findOne({ id: req.params.id });
    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let updDiscount = {} as UpdateDiscount;

    if (description) updDiscount.description = description;
    if (discount_percentage)
      updDiscount.discount_percentage = discount_percentage;
    if (is_active) updDiscount.is_active = is_active;
    if (products) updDiscount.products = products;

    await Discount.findOneAndUpdate(
      { id: req.params.id },
      { $set: updDiscount }
    );

    await Product.updateMany(
      { discount: discount._id, seller_id: req.seller.id },
      { $unset: { discount: "" } }
    );

    await Product.updateMany(
      { _id: { $in: products }, seller_id: req.seller.id },
      { $set: { discount: discount._id } }
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
export const deleteDiscount = async (req: Request, res: Response) => {
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
export const productstoDiscount = async (req: SellerAuthRequest, res: Response) => {
  let success = false;

  try {
    const { products } = req.body;

    let discount = await Discount.findOne({
      id: req.params.id,
      seller_id: req.seller.id,
    });

    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    await Discount.findOneAndUpdate(
      { id: req.params.id, seller_id: req.seller.id },
      { $set: { products } }
    );

    let product = await Product.updateMany(
      { discount: discount._id, seller_id: req.seller.id },
      { $set: { discount: "" } }
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
export const getDiscount = async (req: SellerAuthRequest, res: Response) => {
  let success = false;

  try {
    let discount: any = await Discount.findOne({
      id: req.params.id,
      seller_id: req.seller.id,
    });
    if (!discount) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    discount = await Discount.aggregate([
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
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};
