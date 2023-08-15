import { Router } from "express";
import checkSeller from "../middleware/checkSeller.js";
import { getAllDiscounts, getDiscount, addDiscount, updateDiscount, deleteDiscount, productstoDiscount, } from "../controller/discount.js";
import { body } from "express-validator";
export const discountRouter = Router();
// ROUTE-1: Get All Discounts based on seller
discountRouter.get("/all/discounts", checkSeller, getAllDiscounts);
// ROUTE-2: Get One Discount
discountRouter.get("/:id", checkSeller, getDiscount);
// ROUTE-3: Create Discount
// description, discount_percentage, is_active
discountRouter.post("/create", [
    body("description", "Please enter at least 10 characters").isString(),
    body("discount_percentage", "Please enter Number")
        .isLength({ max: 2 })
        .isNumeric(),
    body("is_active", "Please enter boolean value").isBoolean(),
], checkSeller, addDiscount);
// ROUTE-4: Update Discount
discountRouter.put("/update/:id", [
    body("description", "Please enter at least 10 characters").isString(),
    body("discount_percentage", "Please enter Number")
        .isLength({ max: 2 })
        .isNumeric(),
    body("is_active", "Please enter boolean value").isBoolean(),
], checkSeller, updateDiscount);
// ROUTE-5: Delete Discount
discountRouter.delete("/delete/:id", checkSeller, deleteDiscount);
// ROUTE-6: Add Product to Dicount
discountRouter.post("/add/product/:id", checkSeller, productstoDiscount);
