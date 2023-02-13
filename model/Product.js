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
    custom_information: [
      {
        name: String,
        detail: String,
      },
    ],
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    colors: [string],
    sizes: [String],
    info_type: [String],
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "companys",
      required: true
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true
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
