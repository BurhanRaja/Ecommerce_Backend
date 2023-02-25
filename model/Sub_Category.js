const { Schema, default: mongoose } = require("mongoose");

const SubCategorySchema = new Schema(
  {
    name: String,
    description: String,
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "categorys",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subcategory", SubCategorySchema);
