const { Schema, default: mongoose } = require("mongoose");

const DiscountSchemas = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Discount", DiscountSchemas);
