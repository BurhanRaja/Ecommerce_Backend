const Cart = require("../model/Cart");
const Order = require("../model/Order");
const Sellerorder = require("../model/Sellerorder");
const Useraddress = require("../model/Useraddress");

// Filter all the products based on seller_id
// To send the filtered order for seller

exports.getSingleOrder = async (req, res, next) => {
  let success = false;

  try {
    let order = await Order.findOne({
      id: req.params.id,
      user_id: req.user.id,
    });

    if (!order) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    success = true;

    return res.status(200).send({
      success,
      order,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.getAllOrders = async (req, res, next) => {
  let success = false;

  try {
    let order = await Order({ user: req.user.id });

    if (!order) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    success = true;

    return res.status(200).send({
      success,
      order,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.createOrder = async (req, res, next) => {
  let success = false;

  try {
    const { cart_id, address_id, payment_type, payment_status, is_delivered } =
      req.body;

    let address = await Useraddress.findOne(
      { user_id: req.user.id, addresses: { $elemMatch: { id: address_id } } },
      { addresses: { $elemMatch: { id: address_id } } }
    );

    console.log(address);
    return;

    let order = await Order.create({
      user: req.user.id,
      cart: cart_id,
      address: address.addresses.id,
      payment_type,
      payment_status,
      is_delivered,
    });

    let cart = await Cart.findOneAndUpdate(
      { id: cart_id },
      { $set: { is_active: false } }
    ).populate({
      path: "cartItems",
    });

    console.log(cart);
    return;
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// Get All order based on sellerid
exports.getSellerOrders = async (req, res, next) => {
  let success = true;
  try {
    let order = Order.aggregate([
      { $unwind: "$cart" },
      { $group: { _id: null, clrs: { $push: "$cart" } } },
      { $project: { _id: 0, colors: "$clrs0" } },
    ]);

    console.log(order);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.removeOrder = async (req, res, next) => {};
