const { Schema, default: mongoose } = require("mongoose");
const SubCategory = require("./Sub_Category");
const Product = require("./Product");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "Parentcategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.pre("findOneAndDelete", async function (category, next) {
  await SubCategory.deleteMany({ category_id: category._id });
  await Product.deleteMany({ category_id: category._id });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
