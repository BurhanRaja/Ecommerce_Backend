import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  addReview,
  updateReview,
  deleteReview,
  singleProduct,
  getImageInfo,
  getTrendingProducts,
  getSellerProductCount,
} from "../controller/product.js";
import { body } from "express-validator";
import checkSeller from "../middleware/checkSeller.js";
import checkUser from "../middleware/checkUser.js";

export const productRouter = Router();

// Seller
// ROUTE-1: Get Product
productRouter.get("/", checkSeller, getProducts);

// ROUTE-2: Create Product
productRouter.post(
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
  ],
  checkSeller,
  createProduct
);

// ROUTE-3: Update Product
productRouter.put(
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
  ],
  checkSeller,
  updateProduct
);

// ROUTE-4: Delete Product
productRouter.delete("/delete/:id", checkSeller, deleteProduct);

productRouter.get("/seller/count", checkSeller, getSellerProductCount);

// Client
// ROUTE-1: Write a Review
productRouter.post("/add/review/:id", checkUser, addReview);

// ROUTE-2: Update Review
productRouter.put("/update/review/:id", checkUser, updateReview);

// ROUTE-3: Delete Review
productRouter.delete("/delete/review/:id/:reviewid", checkUser, deleteReview);

// For All
// ROUTE-1: Get All Products
productRouter.get("/all/products", getAllProducts);

// ROUTE-2: Get Single product
productRouter.get("/:id", singleProduct);

// ROUTE-3: Image Info
productRouter.get("/filter/images/:itemId/:id", getImageInfo);

// ROUTE-4: Trending Product
productRouter.get("/trending/products", getTrendingProducts);

