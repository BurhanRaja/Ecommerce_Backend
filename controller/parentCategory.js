const { validationResult } = require("express-validator");
const ParentCategory = require("../model/Parentcategory");

exports.getAllParentCategories = async (req, res, next) => {
  let success = false;
  try {
    const pCategories = await ParentCategory.find();
    if (!pCategories) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    return res.status(200).send({
      success,
      pCategories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.createParentCategory = async (req, res, next) => {
  let success = false;

  let error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ error: error.array() });
  }

  try {
    const { name, description } = req.body;

    let pCategory = await ParentCategory.findOne({ name: name });

    if (pCategory) {
      return res.status(400).send({
        success,
        message: "Parent Category Already exists.",
      });
    }

    pCategory = await ParentCategory.create({
      name,
      description,
    });

    success = true;

    return res.status(200).send({
      success,
      pCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};
