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
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Parentcategory",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Sub_Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        content: String,
        ratings: Number,
        date: Date,
        user_id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    discount: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
