const express = require("express");
const product = require("../../controller/product");
const { body } = require("express-validator");

const router = express.Router();

// name,
// images,
// description,
// custom_information,
// price,
// colors,
// sizes,
// info_type,
// quantity,

// ROUTE-1: Create Product
router.post(
  "/create",
  [
    body("name", "Please enter at least 2 characters").isLength({ min: 2 }),
    body("images", "Please add images").isArray(),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("custom_information", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("price", "Please add Price").isNumeric(),
    body("colors", "Please add a colors.").isArray(),
    body("sizes", "Please add a sizes.").isArray(),
    body("quantity", "Please a available quantity.").isNumeric(),
  ],
  product.createProduct
);

module.exports = router;
