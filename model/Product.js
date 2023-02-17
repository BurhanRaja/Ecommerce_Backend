const { Schema, default: mongoose } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [
        {
          url: String,
          color: String,
          size: [String],
          info_type: String,
        },
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    custom_information: [String],
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    colors: [String],
    sizes: [String],
    info_type: [String],
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "sellers",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reviews: [{ body: String, rating: Number, date: Date, author: String }],
    discount_id: {
      type: Schema.Types.ObjectId,
      ref: "discounts",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
