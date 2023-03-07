const { validateReq } = require("../utils/vaidation");
const Subcategory = require("../model/Sub_Category");

// Get SubCategory based on category
exports.getSubCategories = async (req, res, next) => {
  let success = false;

  try {
    let subCat = await Subcategory.find({ category_id: req.params.catid });

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Create Sub Category
exports.createSubCategory = async (req, res, next) => {
  let success = true;

  validateReq(req, res);

  try {
    const { name, description, category_id, parent_category_id } = req.body;

    let subCat = await Subcategory.findOne({
      name: name,
      category_id: category_id,
    });

    if (subCat) {
      return res.status(400).send({
        success: false,
        message: "Sub-category in Category Already Exists.",
      });
    }

    subCat = await Subcategory.create({
      name,
      description,
      category_id,
      parent_category_id
    });

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Update Sub-category
exports.updateSubCategory = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description, category_id, parent_category_id } = req.body;

    let updSubCat = {};

    if (name) updSubCat.name = name;
    if (description) updSubCat.description = description;
    if (category_id) updSubCat.category_id = category_id;
    if (parent_category_id) updSubCat.parent_category_id = parent_category_id;

    let subCat = await Subcategory.findById(req.params.id);

    if (!subCat) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    subCat = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { $set: updSubCat },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Sub-category
exports.deleteSubCategory = async (req, res, next) => {
  let success = false;

  try {
    let subCat = await Subcategory.findById(req.params.id);
    if (!subCat) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    subCat = await Subcategory.findOneAndDelete(req.params.id, { $set: null });

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};
