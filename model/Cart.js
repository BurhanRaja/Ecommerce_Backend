let { Schema, default: mongoose } = require("mongoose");

const CartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      info: String,
      image: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      size: String,
      price: Number
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
