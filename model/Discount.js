const { Schema, default: mongoose } = require("mongoose");

const DiscountSchemas = new Schema(
  {
    name: String,
    description: String,
    discount_percentage: Number,
    active: Boolean,
    activeTill: Date,
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Seller"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Discount", DiscountSchemas);