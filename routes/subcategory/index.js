const express = require("express");
const {
  getAllSubCategories,
  getSubCategoriesofCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategoriesfromParent,
} = require("../../controller/subcategory");
const { body } = require("express-validator");

const router = express.Router();

router.get("/", getAllSubCategories);

router.get("/category/:catid", getSubCategoriesofCategories);

router.get("/parentcategory/:id", getAllSubCategoriesfromParent);

router.post(
  "/create",
  [
    body("name", "Please enter at least 3 characters").isLength({ min: 3 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 3,
    }),
  ],
  createSubCategory
);

router.put(
  "/update/:id",
  [
    body("name", "Please enter at least 3 characters").isLength({ min: 3 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 3,
    }),
  ],
  updateSubCategory
);

router.delete("/delete/:id", deleteSubCategory);

module.exports = router;
