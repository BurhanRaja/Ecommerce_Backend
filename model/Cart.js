let { Schema, default: mongoose } = require("mongoose");

const CartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      seller: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      product_info: {
        color: String,
        size: String,
        info_type: String,
        thumbnail: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: Number,
    },
  ],
  total: {
    type: Number,
  },
  is_active: {
    type: Schema.Types.Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
