import { Router } from "express";
import { getAllParentCategories, getSingleParentCategory, createParentCategory, updateParentCategory, deleteCategory, } from "../controller/parentCategory.js";
import { body } from "express-validator";
export const parentCategoryRouter = Router();
// ROUTE-1: Get Categories
parentCategoryRouter.get("/", getAllParentCategories);
parentCategoryRouter.get("/:id", getSingleParentCategory);
parentCategoryRouter.post("/create", [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
        min: 10,
    }),
], createParentCategory);
parentCategoryRouter.put("/update/:id", [
    body("name", "Please enter at least 4 characters").isLength({ min: 4 }),
    body("description", "Please enter at least 10 characters").isLength({
        min: 10,
    }),
], updateParentCategory);
parentCategoryRouter.delete("/delete/:id", deleteCategory);
