const { Schema, default: mongoose } = require("mongoose");

const CartItemSchema = new Schema(
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
    is_ordered: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cartitem", CartItemSchema);
