const Cart = require("../model/Cart");
const Order = require("../model/Order");

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
    const { user, cart, address, payment_status, is_delievered } = req.body;

    let order = await Order.create({
      user,
      cart,
      address,
      payment_status,
      is_delievered,
    });

    let cartActive = await Cart.findOneAndUpdate(
      { id: cart },
      { $set: { is_active: false } }
    );

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

exports.updateOrder = async (req, res, next) => {
  let success = false;

  try {
    let order = await Order.findOne({ id: req.params.id });

    if (!order) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let body = req.body;

    let updOrder = {};

    if (body.is_delievered) {
      updOrder.is_delievered = is_delievered;
    }
    if (body.payment_status) {
      updOrder.payment_status = payment_status;
    }
    if (body.payment_type) {
      updOrder.payment_type = payment_type;
    }

    order = await Order.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: updOrder,
      }
    );

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


exports.removeOrder = async (req, res, next) => {
    
}