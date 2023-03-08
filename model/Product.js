const { Schema, default: mongoose } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images_info: {
      type: [
        {
          url: String,
          color: String,
          size: String,
          info_type: String,
          quantity: Number,
        },
      ],
      required: true,
    },
    thumbnail: { 
      type: String, 
      required: true 
    },
    description: {
      type: String,
      required: true,
    },
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
    seller_info: {
      type: Schema.Types.ObjectId,
      ref: "Sellerinfo",
      required: true
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
        created_at: Date,
        updated_at: Date,
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
