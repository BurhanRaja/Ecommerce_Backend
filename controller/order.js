const Cart = require("../model/Cart");
const Order = require("../model/Order");
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
    const { cart, payment_type, payment_status, is_delivered } = req.body;

    let address = await Useraddress.findOne({ user_id: req.user.id });
    // console.log(address);

    let order = await Order.create({
      user: req.user.id,
      cart,
      address: address.id,
      payment_type,
      payment_status,
      is_delivered,
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
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// exports.updateOrder = async (req, res, next) => {
//   let success = false;

//   try {
//     let order = await Order.findOne({ id: req.params.id });

//     if (!order) {
//       return res.status(404).send({ success, message: "404 Not Found" });
//     }

//     let body = req.body;

//     let updOrder = {};

//     if (body.is_delievered) {
//       updOrder.is_delievered = is_delievered;
//     }
//     if (body.payment_status) {
//       updOrder.payment_status = payment_status;
//     }
//     if (body.payment_type) {
//       updOrder.payment_type = payment_type;
//     }

//     order = await Order.findOneAndUpdate(
//       { id: req.params.id },
//       {
//         $set: updOrder,
//       }
//     );

//     success = true;

//     return res.status(200).send({
//       success,
//       order,
//     });
//   } catch (err) {
//     return res
//       .status(500)
//       .send({ success: false, error: "Internal Server Error." });
//   }
// };

exports.getSellerOrders = async (req, res, next) => {
  let success = true;
  try {
    let allCartOrder = await Cart.find({
      products: { seller: req.seller.id },
    });

    // let orders = await Order.find().populate("cart");

    // let allCartOrder = await Order.find().populate("cart");

    console.log(req.seller.id);

    success = true;

    return res.status(200).send({
      success,
      order: allCartOrder,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

exports.removeOrder = async (req, res, next) => {};
