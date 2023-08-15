import { Router } from "express";
import checkSeller from "../middleware/checkSeller.js";
import { getInfo, createInfo, updateInfo, deleteInfo, getAllSellerInfo, } from "../controller/seller/info.js";
import { body } from "express-validator";
export const sellerInfoRouter = Router();
sellerInfoRouter.get("/all/:parentid", getAllSellerInfo);
sellerInfoRouter.get("/", checkSeller, getInfo);
sellerInfoRouter.post("/create", checkSeller, [
    body("phone", "Please enter at most 10 characters.").isLength({
        max: 10,
        min: 10,
    }),
], createInfo);
sellerInfoRouter.put("/update/:id", checkSeller, [
    body("phone", "Please enter at most 10 characters.").isLength({
        max: 10,
        min: 10,
    }),
], updateInfo);
sellerInfoRouter.delete("/delete/:id", deleteInfo);
