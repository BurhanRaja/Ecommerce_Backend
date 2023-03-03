const { Schema, default: mongoose } = require("mongoose");
const Product = require("./Product");

const SubCategorySchema = new Schema(
  {
    name: String,
    description: String,
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Parentcategory",
      required: true
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SubCategorySchema.pre("findOneAndDelete", async function (subcategory, next) {
  await Product.deleteMany({ sub_category_id: subcategory._id });
  next();
});

module.exports = mongoose.model("Subcategory", SubCategorySchema);
