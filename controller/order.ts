import Cart from "../model/Cart.js";
import Cartitem from "../model/Cartitem.js";
import Order from "../model/Order.js";
import Sellerorder from "../model/Sellerorder.js";
import mongoose, { Types } from "mongoose";
import Useraddress from "../model/Useraddress.js";
import { SellerAuthRequest, UserAuthRequest } from "../utils/defineauth.js";
import { Request, Response } from "express";

// Filter all the products based on seller_id
// To send the filtered order for seller

// Get All Order
export const getAllOrders = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  try {
    let orders = await Order.find({ user: req.user.id });

    if (!orders) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    success = true;

    return res.status(200).send({
      success,
      orders,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Get Single Order
export const getSingleOrder = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  try {
    let order = await Order.findOne({
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

    let address = await Useraddress.findOne(
      {
        user_id: req.user.id,
        "addresses._id": order.address,
      },
      { addresses: { $elemMatch: { _id: order.address } } }
    );

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
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Create Order
export const createOrder = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  try {
    const {
      cart_id,
      address_id,
      payment_type,
      payment_status,
      is_delivered,
      total,
    } = req.body;

    let order = await Order.create({
      user: req.user.id,
      cart: cart_id,
      address: address_id,
      payment_type,
      payment_status,
      is_delivered,
      total,
    });

    let cart = await Cart.findOneAndUpdate(
      { id: cart_id, is_active: true },
      { $set: { is_active: false } }
    );

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    let cartItems = await Cartitem.find({ _id: { $in: cart.cartItems } });

    for (let i = 0; i < cartItems.length; i++) {
      await addSeller(
        cartItems[i].seller,
        cartItems[i]._id,
        address_id,
        req.user.id
      );
    }

    success = true;

    return res.status(200).send({
      success,
      order,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

const addSeller = async (
  sellerid: Types.ObjectId,
  cartItem: Types.ObjectId,
  addressid: Types.ObjectId,
  userid: Types.ObjectId
) => {
  let sellerOrder = await Sellerorder.findOne({ seller: sellerid.toString() });

  if (!sellerOrder) {
    sellerOrder = await Sellerorder.create({
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
  } else {
    sellerOrder = await Sellerorder.findOneAndUpdate(
      { seller: sellerid.toString() },
      {
        $push: {
          products: {
            item: cartItem,
            user: userid,
            address: addressid,
            ispayed: false,
          },
        },
      }
    );
  }
};

// Get All order based on sellerid
export const getSellerOrders = async (req: SellerAuthRequest, res: Response) => {
  let success = false;
  try {
    let sellerOrder = await Sellerorder.aggregate([])
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
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  let success = false;
  try {
    const { is_delivered, payment_status } = req.body;

    let order = await Order.findOne({
      _id: req.params.id,
    });

    if (!order) {
      return res.status(404).send({
        success,
        message: "Order Not Found",
      });
    }

    await Order.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          is_delivered,
          payment_status,
        },
      }
    );

    success = true;

    return res.status(200).send({
      success,
      message: "Order Updated",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};
