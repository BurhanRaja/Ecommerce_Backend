import { Router } from "express";
import {
  getAllSubCategories,
  getSubCategoriesofCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategoriesfromParent,
} from "../controller/subcategory.js";
import { body } from "express-validator";

export const subCategoryRouter = Router();

subCategoryRouter.get("/", getAllSubCategories);

subCategoryRouter.get("/category/:catid", getSubCategoriesofCategories);

subCategoryRouter.get("/parentcategory/:id", getAllSubCategoriesfromParent);

subCategoryRouter.post(
  "/create",
  [
    body("name", "Please enter at least 3 characters").isLength({ min: 3 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 3,
    }),
  ],
  createSubCategory
);

subCategoryRouter.put(
  "/update/:id",
  [
    body("name", "Please enter at least 3 characters").isLength({ min: 3 }),
    body("description", "Please enter at least 10 characters").isLength({
      min: 3,
    }),
  ],
  updateSubCategory
);

subCategoryRouter.delete("/delete/:id", deleteSubCategory);
