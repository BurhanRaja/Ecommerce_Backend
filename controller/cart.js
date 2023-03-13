const Cart = require("../model/Cart");

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

    if (product.proudctid) pDetail.product_id = product.product_id;
    if (product.sellerid) pDetail.seller_id = product.seller_id;
    if (product.name) pDetail.name = product.name;
    if (product.color) pDetail.color = product.color;
    if (product.image) pDetail.image = product.image;
    if (product.info) pDetail.info = product.info;
    if (product.size) pDetail.size = product.size;
    if (product.quantity) pDetail.quantity = product.quantity;
    if (product.price) pDetail.price = product.price;

    let cart = await Cart.findOne({ user_id: req.user.id, is_active: true });

    if (cart) {
      cart = await Cart.findOneAndUpdate(
        { user_id: req.user.id, is_active: true },
        {
          $push: {
            products: pDetail,
          },
          $set: { total: cart.total + pDetail.price },
        }
      );
    } else {
      cart = await Cart.create({
        user_id: req.user.id,
        products: [pDetail],
        total: pDetail.price,
        is_active: true,
      });
    }

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

// Remove From Cart
exports.removeFromCart = async (req, res, next) => {
  let success = false;
  try {
    let cart = await Cart.findOne({ id: req.params.id, user_id: req.user.id });

    if (!cart) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    cart = await Cart.findOneAndUpdate(
      { id: req.params.id, user_id: req.params.id },
      {
        $pull: { products: { _id: req.params.productid } },
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
