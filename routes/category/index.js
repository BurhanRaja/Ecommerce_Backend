const express = require("express");
const category = require("../../controller/category");
const { body } = require("express-validator");

const router = express.Router();

// ROUTE-1: Create Category
router.post(
  "/create",
  [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
  ],
  category.createCategory
);

// ROUTE-2: Get Categories
router.get("/", category.getAllCategories);

module.exports = router;
