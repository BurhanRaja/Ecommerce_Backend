const Cart = require("../model/Cart");
const Cartitem = require("../model/Cartitem");
const Order = require("../model/Order");
const Sellerorder = require("../model/Sellerorder");
const mongoose = require("mongoose");
const Useraddress = require("../model/Useraddress");

// Filter all the products based on seller_id
// To send the filtered order for seller

exports.getAllOrders = async (req, res, next) => {
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

exports.getSingleOrder = async (req, res, next) => {
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
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.createOrder = async (req, res, next) => {
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

const addSeller = async (sellerid, cartItem, addressid, userid) => {
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

  return sellerOrder;
};

// Get All order based on sellerid
exports.getSellerOrders = async (req, res, next) => {
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
      res.status(404).send({ success, message: "404 Not Found." });
    }

    success = true;

    return res.status(200).send({
      success,
      sellerOrder,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.removeOrder = async (req, res, next) => {};
