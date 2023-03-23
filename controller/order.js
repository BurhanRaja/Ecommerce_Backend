const Cart = require("../model/Cart");
const Cartitem = require("../model/Cartitem");
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

    let order = await Order.create({
      user: req.user.id,
      cart: cart_id,
      address: address_id,
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

    let cartItems = await Cartitem.find({ id: { $in: cart.cartItems } });

    for (let i = 0; i < cartItems.length; i++) {
      await addSeller(
        cartItems[i].seller,
        cartItems[i].id,
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
    let sellerOrder = Sellerorder.findOne({ seller: req.seller.id });

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
