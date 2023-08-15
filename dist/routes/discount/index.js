const { Router } = require("express");
const checkSeller = require("../../middleware/checkSeller");
const { getAllDiscounts, getDiscount, addDiscount, updateDiscount, deleteDiscount, productstoDiscount, } = require("../../controller/discount");
const { body } = require("express-validator");
const router = Router();
// ROUTE-1: Get All Discounts based on seller
router.get("/all/discounts", checkSeller, getAllDiscounts);
// ROUTE-2: Get One Discount
router.get("/:id", checkSeller, getDiscount);
// ROUTE-3: Create Discount
// description, discount_percentage, is_active
router.post("/create", [
    body("description", "Please enter at least 10 characters").isString(),
    body("discount_percentage", "Please enter Number")
        .isLength({ max: 2 })
        .isNumeric(),
    body("is_active", "Please enter boolean value").isBoolean(),
], checkSeller, addDiscount);
// ROUTE-4: Update Discount
router.put("/update/:id", [
    body("description", "Please enter at least 10 characters").isString(),
    body("discount_percentage", "Please enter Number")
        .isLength({ max: 2 })
        .isNumeric(),
    body("is_active", "Please enter boolean value").isBoolean(),
], checkSeller, updateDiscount);
// ROUTE-5: Delete Discount
router.delete("/delete/:id", checkSeller, deleteDiscount);
// ROUTE-6: Add Product to Dicount
router.post("/add/product/:id", checkSeller, productstoDiscount);
module.exports = router;
export {};
