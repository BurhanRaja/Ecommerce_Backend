const Sellerorder = require("../model/Sellerorder");
const Useraddress = require("../model/Useraddress");

exports.getAllSellerOrder = async (req, res) => {
  let success = false;

  try {
    let sellerOrders = await Sellerorder.findOne({
      seller: req.seller.id,
    })
      .populate({
        path: "products.item",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .populate("products.user");

    if (!sellerOrders) {
      return res.status(404).send({
        success: false,
        message: "404 Not Found.",
      });
    }

    success = true;
    return res.status(200).send({
      success,
      sellerOrders,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getSingleSellerOrder = async (req, res) => {
  let success = false;
  try {
    let sellerOrder = await Sellerorder.findOne(
      {
        seller: req.seller.id,
        "products._id": req.params.id,
      },
      { products: { $elemMatch: { _id: req.params.id } } }
    )
      .populate({
        path: "products.item",
        populate: {
          path: "product",
          model: "Product",
        },
      })
      .populate("products.user");

    if (!sellerOrder) {
      return res.status(404).send({
        success: false,
        message: "404 not found",
      });
    }

    let productAddressId = sellerOrder.products[0].address;
    let userId = sellerOrder.products[0].user._id;

    let address = await Useraddress.findOne(
      {
        user_id: userId,
        "addresses._id": productAddressId,
      },
      { addresses: { $elemMatch: { _id: productAddressId } } }
    );

    success = true;

    return res.status(200).send({
      success,
      orderdetails: {
        _id: sellerOrder._id,
        product: sellerOrder.products[0].item,
        user: sellerOrder.products[0].user,
        address: address.addresses[0],
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getSellerOrderCount = async (req, res) => {
  let success = false;
  try {
    let sellerOrder = await Sellerorder.findOne({ seller: req.seller.id });

    let count = sellerOrder.products.length;

    success = true;

    return res.status(200).send({
      success,
      sellerordercount: count,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
