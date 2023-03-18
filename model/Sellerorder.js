const { Schema, default: mongoose } = require("mongoose");

const SellerOrderSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Seller",
  },
  user_order: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Order"
  },
  products: [
    {
      productid: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      product_info: {
        color: String,
        size: String,
        info_type: String,
        quantity: Number,
        thumbnail: String,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
});
