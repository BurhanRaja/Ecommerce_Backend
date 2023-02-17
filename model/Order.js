const { Schema, default: mongoose } = require("mongoose");

const OrderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "products" },
      color: String,
      size: String,
      info_type: String,
      qty: { type: Number },
      price: {
        type: Schema.Types.Decimal128,
        default: 0,
      },
      seller_info_id: { type: Schema.Types.ObjectId, ref: "sellerinfos" },
      image: {
        type: String,
        default: 1,
      },
    },
  ],
});


module.exports = mongoose.model("Order", OrderSchema);