const express = require("express");
const sellerAuth = require("../../controller/seller/auth");
const product = require("../../controller/product");
const { body } = require("express-validator");

const router = express.Router();

// ROUTE-1: Register
router.post(
  "/register",
  [
    body("fname", "Please enter at least 2 characters in first name.").isLength(
      { min: 2 }
    ),
    body("lname", "Please enter at least 2 characters in last name").isLength({
      min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
  ],
  sellerAuth.register
);

// ROUTE-2: Login
router.post(
  "/login",
  [
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
  ],
  sellerAuth.login
);

// name,
// images,
// description,
// custom_information,
// price,
// colors,
// sizes,
// info_type,
// quantity,

// ROUTE-3: Products
router.post(
  "/create/product",
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
