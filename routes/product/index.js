const express = require("express");
const product = require("../../controller/product");
const { body } = require("express-validator");
const checkSeller = require("../../middleware/checkSeller");

const router = express.Router();

// Admin
// ROUTE-1: Get Product
router.get("/", checkSeller, product.getProduct);

// ROUTE-2: Create Product
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
  checkSeller,
  product.createProduct
);

// ROUTE-3: Update Product
router.put(
  "/update/:id",
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
  checkSeller,
  product.updateProduct
);

// ROUTE-4: Delete Product
router.delete("/delete/:id", checkSeller, product.deleteProduct);


// Client
// ROUTE-1: Get All Products
router.get("/all/products", product.getAllProducts);

module.exports = router;
