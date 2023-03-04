const { Schema, default: mongoose } = require("mongoose");

const DiscountSchemas = new Schema(
  {
    description: String,
    discount_percentage: Number,
    is_active: Boolean,
    starts_on: Date,
    expires_on: Date,
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    products: [
      {
        
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Discount", DiscountSchemas);
