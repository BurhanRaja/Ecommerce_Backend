import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoriesOfParent,
  updateCategory,
  deleteCategory,
} from "../controller/category.js";
import { body } from "express-validator";

export const categoryRouter = Router();

// ROUTE-1: Create Category
categoryRouter.post(
  "/create",
  [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 10,
    }),
  ],
  createCategory
);

// ROUTE-2: Get Categories
categoryRouter.get("/", getAllCategories);

categoryRouter.get("/parentcategory/:parentId", getCategoriesOfParent);

//
categoryRouter.put("/update/:id", updateCategory);

//
categoryRouter.delete("/delete/:id", deleteCategory);

