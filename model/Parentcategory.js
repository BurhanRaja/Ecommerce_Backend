const { Schema, default: mongoose } = require("mongoose");
const Category = require("./Category");
const Sub_Category = require("./Sub_Category");
const Product = require("./Product");

const ParentCategorySchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

ParentCategorySchema.pre("findOneAndDelete", async function(parentcategory, next) {
  await Category.deleteMany({parent_id: parentcategory._id});
  await Sub_Category.deleteMany({parent_category_id: parentcategory._id});
  await Product.deleteMany({parent_category_id: parentcategory._id});
  next()
})

module.exports = mongoose.model("ParentCategory", ParentCategorySchema);
