const { validationResult } = require("express-validator");
const Category = require("../model/Category");

exports.getAllCategories = async (req, res, next) => {
  let success = false;
  try {
    const categories = await Category.find();
    if (!categories) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    return res.status(200).send({
      success,
      categories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.createCategory = async (req, res, next) => {
  let success = false;

  let error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ error: error.array() });
  }

  try {
    const { name, description, parent_id } = req.body;

    let category = await Category.findOne({ name: name });

    if (category) {
      return res.status(400).send({
        success,
        message: "Category Already exists.",
      });
    }

    category = await Category.create({
      name,
      description,
      parent_id
    });

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};
