const { Schema, default: mongoose } = require("mongoose");

const SellerOrderSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    products: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: "Cartitem",
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        address: {
          type: Schema.Types.ObjectId,
          ref: "Useraddress",
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sellerorder", SellerOrderSchema);