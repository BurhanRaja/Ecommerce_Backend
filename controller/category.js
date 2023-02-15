const { validationResult } = require("express-validator");
const Category = require("../model/Category");

exports.getAllCategories = async (req, res, next) => {
  let success = false;
  try {
    const categories = Category.find();
    if (!categories) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    res.status(200).send({
      success,
      categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};


