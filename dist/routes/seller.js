import { Router } from "express";
import { register, login } from "../controller/seller/auth.js";
import { body } from "express-validator";
import checkSeller from "../middleware/checkSeller.js";
import { getSeller, updateSeller, deleteSeller, } from "../controller/seller/seller.js";
export const sellerRouter = Router();
// ROUTE-1: Register
sellerRouter.post("/register", [
    body("fname", "Please enter at least 2 characters in first name.").isLength({ min: 2 }),
    body("lname", "Please enter at least 2 characters in last name").isLength({
        min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
], register);
// ROUTE-2: Login
sellerRouter.post("/login", [
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
], login);
sellerRouter.get("/", checkSeller, getSeller);
sellerRouter.put("/update", checkSeller, [
    body("fname", "Please enter at least 2 characters in first name.").isLength({ min: 2 }),
    body("lname", "Please enter at least 2 characters in last name").isLength({
        min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
], updateSeller);
sellerRouter.delete("/delete", checkSeller, deleteSeller);
