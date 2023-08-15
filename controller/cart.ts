import mongoose from "mongoose";
import { Request, Response } from "express";
import Cart from "../model/Cart.js";
import Cartitem from "../model/Cartitem.js";
import Product from "../model/Product.js";
import { UserAuthRequest } from "../utils/defineauth.js";
import { ProductDetails } from "../utils/defineother.js";

// Get Current Active Cart
export const getCart = async (req: UserAuthRequest, res: Response) => {
  let success = false;
  try {
    let cart = await Cart.findOne({
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
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Add To Cart
export const addToCart = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  try {
    let product = req.body;
    let pDetail = {} as ProductDetails;

    if (product.price) pDetail.price = product.price;
    if (product.sellerid) pDetail.seller = product.sellerid;
    if (product.seller_info_id) pDetail.seller_info_id = product.seller_info_id;
    if (product.productid) pDetail.product = product.productid;
    if (product.quantity) pDetail.quantity = Number(product.quantity);

    pDetail.product_info = {};

    if (product.size) pDetail.product_info.size = product.size;
    if (product.color) pDetail.product_info.color = product.color;
    if (product.info_type) pDetail.product_info.info_type = product.info_type;
    if (product.thumbnail) pDetail.product_info.thumbnail = product.thumbnail;

    pDetail.is_ordered = false;

    let quant = Number(pDetail.quantity) * -1;

    product = await Product.findOneAndUpdate(
      {
        _id: pDetail.product,
        "images_info.color": pDetail.product_info.color,
      },
      {
        $inc: {
          "images_info.$.quantity": quant,
        },
      }
    );

    let cartItem = await Cartitem.create(pDetail);

    let cart = await Cart.findOne({ user_id: req.user.id, is_active: true });

    if (cart) {
      cart = await Cart.findOneAndUpdate(
        { user_id: req.user.id, is_active: true },
        {
          $push: {
            cartItems: cartItem.id,
          },
        }
      );
    } else {
      cart = await Cart.create({
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
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Remove From Cart
export const removeFromCart = async (req: UserAuthRequest, res: Response) => {
  let success = false;
  try {
    let cart = await Cart.findOne({ id: req.params.id, user_id: req.user.id });

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let cartItem = await Cartitem.findOne({ id: req.params.itemid });

    if (!cartItem) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    await Product.findOneAndUpdate(
      {
        _id: cartItem.product,
        "images_info.color": cartItem.product_info.color,
      },
      {
        $inc: {
          "images_info.$.quantity": cartItem.quantity,
        },
      }
    );

    let cartItems = await Cartitem.findOneAndDelete({ id: req.params.itemid });

    cart = await Cart.findOneAndUpdate(
      {
        id: req.params.id,
        user_id: req.user.id,
        is_active: true,
      },
      {
        $pull: { cartItems: req.params.itemid },
      }
    );

    success = true;

    return res.status(200).send({
      success,
      cart,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// add Total
export const addTotal = async (req: UserAuthRequest, res: Response) => {
  let success = true;

  try {
    let cart = await Cart.findOne({ user_id: req.user.id, is_active: true });

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let totalPrice = await Cart.aggregate([
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
      totalPrice: totalPrice[0]?.total,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};
