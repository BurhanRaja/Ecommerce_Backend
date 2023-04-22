const { default: mongoose } = require("mongoose");
const Sellerorder = require("../model/Sellerorder");
const Useraddress = require("../model/Useraddress");
const { Buffer } = require("node:buffer");

exports.getAllSellerOrder = async (req, res) => {
  let success = false;

  try {
    let sellerOrders = await Sellerorder.aggregate([
      {
        $match: { seller: new mongoose.Types.ObjectId(req.seller.id) },
      },
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $lookup: {
          from: "cartitems",
          localField: "products.item",
          foreignField: "_id",
          as: "productItems",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "products.user",
          foreignField: "_id",
          as: "productUsers",
        },
      },
      {
        $lookup: {
          from: "user_addresses",
          localField: "products.address",
          foreignField: "addresses._id",
          as: "productAddresses",
        },
      },
      {
        $unwind: {
          path: "$productItems",
        },
      },
      {
        $unwind: {
          path: "$productAddresses",
        },
      },
      {
        $unwind: {
          path: "$productUsers",
        },
      },
      {
        $group: {
          _id: "$_id",
          products: {
            $push: {
              item: "$productItems",
              user: "$productUsers",
              address: "$productAddresses",
            },
          },
        },
      },
    ]);

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
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
