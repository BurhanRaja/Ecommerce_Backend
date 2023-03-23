const Cart = require("../model/Cart");
const Cartitem = require("../model/Cartitem");

// Get Current Active Cart
exports.getCart = async (req, res, next) => {
  let success = false;
  try {
    let cart = await Cart.findOne({ user_id: req.user.id, is_active: true });

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
exports.addToCart = async (req, res, next) => {
  let success = false;

  try {
    const product = req.body;
    let pDetail = {};

    if (product.price) pDetail.price = product.price;
    if (product.sellerid) pDetail.seller = product.sellerid;
    if (product.seller_info_id) pDetail.seller_info_id = product.seller_info_id;
    if (product.productid) pDetail.product = product.productid;
    if (product.quantity) pDetail.quantity = product.quantity;

    pDetail.product_info = {};

    if (product.size) pDetail.product_info.size = product.size;
    if (product.color) pDetail.product_info.color = product.color;
    if (product.info_type) pDetail.product_info.info_type = product.info_type;
    if (product.thumbnail) pDetail.product_info.thumbnail = product.thumbnail;

    pDetail.is_ordered = false;

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
exports.removeFromCart = async (req, res, next) => {
  let success = false;
  try {
    let cart = await Cart.findOne({ id: req.params.id, user_id: req.user.id });

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    let cartItems = await Cartitem.findOneAndDelete({ id: req.params.itemid });

    cart = await Cart.findOneAndUpdate(
      {
        id: req.params.id,
        user_id: req.user.id,
      },
      {
        $pull: { cartItems: { _id: req.params.itemid } },
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
exports.addTotal = async (req, res, next) => {
  let success = true;

  try {
    let { total_price } = req.body;

    let cart = await Cart.findOne({ id: req.params.id });

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    cart = await Cart.findOne({ id: req.params.id });

    let totalPrice = await Cartitem.aggregate([
      {
        $match: { id: { $in: cart.cartItems } },
      },
      {
        $group: {
          _id: null,
          sum_val: { $sum: "$price" },
        },
      },
    ]);

    console.log(totalPrice);
    return

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
