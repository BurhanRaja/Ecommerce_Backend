const express = require("express");
const pCategory = require("../../controller/parentCategory");
const { body } = require("express-validator");
const router = express.Router();

// ROUTE-1: Get Categories
router.get("/", pCategory.getAllParentCategories);

router.post(
  "/create",
  [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
  ],
  pCategory.createParentCategory
);

router.put(
  "/update/:id",
  [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
  ],
  pCategory.updateParentCategory
);

router.delete("/delete/:id", pCategory.deleteCategory);

module.exports = router;
