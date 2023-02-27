const Parentcategory = require("../model/Parentcategory");
const Category = require("../model/Category");
const Subcategory = require("../model/Sub_Category");
const Product = require("../model/Product");

const Seller = require("../model/Seller");
const Sellerinfo = require("../model/Sellerinfo");

const User = require("../model/User");
const Useraddress = require("../model/Useraddress");

exports.parentCatCascade = async (req, res, next) => {};

exports.categoryCascade = async (req, res, next) => {};

exports.subcategoryCascade = async (req, res, next) => {};

exports.sellerCascade = async (req, res, next) => {
  let sellerInfo = await Sellerinfo.findOne({ seller_id: req.user.id });
  if (!sellerInfo) {
    next();
  }
  sellerInfo = await Sellerinfo.findOneAndDelete(
    { seller_id: req.seller.id },
    { $set: null }
  );
  next();
};

exports.userCascade = async (req, res, next) => {
  let userAdd = Useraddress.findOne({ user_id: req.user.id });

  if (!userAdd) {
    next();
  }

  userAdd = await Useraddress.findOneAndDelete(
    { user_id: req.user.id },
    { $set: null }
  );

  next();
};
