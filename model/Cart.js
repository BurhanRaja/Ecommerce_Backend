let { Schema, default: mongoose } = require("mongoose");

const CartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
      },
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      product_info: {
          color: String,
          size: String,
          info: String,
          total_quantity: Number,
          urls: [String]
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: Number,
    },
  ],
  total: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  is_active: {
    type: Schema.Types.Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
