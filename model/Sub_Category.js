const { Schema, default: mongoose } = require("mongoose");

const SubCategorySchema = new Schema(
  {
    name: String,
    description: String,
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);


