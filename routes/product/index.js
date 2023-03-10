const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addReview,
  updateReview,
  deleteReview,
  singleProduct,
} = require("../../controller/product");
const { body } = require("express-validator");
const checkSeller = require("../../middleware/checkSeller");
const checkUser = require("../../middleware/checkUser");

const router = express.Router();

// Seller
// ROUTE-1: Get Product
router.get("/", checkSeller, getProducts);

// ROUTE-2: Create Product
router.post(
  "/create",
  [
    body("name", "Please enter at least 2 characters").isLength({ min: 2 }),
    body("images_info", "Please add images").isArray(),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("thumbnail", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("price", "Please add Price").isNumeric(),
    body("colors", "Please add a colors.").isArray(),
    body("sizes", "Please add a sizes.").isArray(),
    body("quantity", "Please a available quantity.").isNumeric(),
  ],
  checkSeller,
  createProduct
);

// ROUTE-3: Update Product
router.put(
  "/update/:id",
  [
    body("name", "Please enter at least 2 characters").isLength({ min: 2 }),
    body("images_info", "Please add images").isArray(),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("thumbnail", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
    body("price", "Please add Price").isNumeric(),
    body("colors", "Please add a colors.").isArray(),
    body("sizes", "Please add a sizes.").isArray(),
    body("quantity", "Please a available quantity.").isNumeric(),
  ],
  checkSeller,
  updateProduct
);

// ROUTE-4: Delete Product
router.delete("/delete/:id", checkSeller, deleteProduct);

// Client
// ROUTE-1: Get All Products
router.get("/all/products", getAllProducts);

// ROUTE-2: Write a Review
router.post("/add/review", checkUser, addReview);

// ROUTE-3: Update Review
router.put("/update/review/:id", checkUser, updateReview);

// ROUTE-4: Delete Review
router.delete("/delete/review/:id/:reviewid", checkUser, deleteReview);


// For All
// ROUTE-1: Get Single product
router.get("/:id", singleProduct);

module.exports = router;
