const Parentcategory = require("../model/Parentcategory");
const Category = require("../model/Category");
const Subcategory = require("../model/Sub_Category");
const Product = require("../model/Product");

const Sellerinfo = require("../model/Sellerinfo");

const Useraddress = require("../model/Useraddress");

exports.parentCatCascade = async (req, res, next) => {
  let category = await Category.find({ parent_id: req.params.id });
  if (!category) {
    next();
  }

  category = await Category.

  console.log(category);
  
};

exports.categoryCascade = async (req, res, next) => {
  let subcategory = await Subcategory.find({ category_id: req.params.id });
  if (!subcategory) {
    next();
  }

  let product = await Product.find({ category_id: req.params.id });
  if (!product) {
    next();
  }

  subcategory = await Subcategory.deleteMany({ category_id: req.params.id });
  product = await Product.deleteMany({ category_id: req.params.id });

  next();
};


