const Category = require("../model/Category");
const { validateReq } = require("../utils/vaidation");

// Get All Categories
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

exports.getCategoriesOfParent = async (req, res, next) => {
  let success = false;
  try {
    const parentId = req.params.parentId;
    const categories = await Category.find({ parent_id: parentId });

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

// Create Category
exports.createCategory = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

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
      parent_id,
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

// Update Category
exports.updateCategory = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description, parent_id } = req.body;

    let updCat = {};

    if (name) updCat.name = name;
    if (description) updCat.description = description;
    if (parent_id) updCat.parent_id = parent_id;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updCat },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Category
exports.deleteCategory = async (req, res, next) => {
  let success = false;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        success,
        message: "404 Not Found",
      });
    }

    category = await Category.findByOneAndDelete(req.params.id, { $set: null });

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};
