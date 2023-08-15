import { Router } from "express";
import { register, login } from "../controller/client/auth.js";
import { getUser, updateUser, deleteUser } from "../controller/client/user.js";
import { body } from "express-validator";
import checkUser from "../middleware/checkUser.js";
export const userRouter = Router();
// ROUTE-1: Regitser
// ROUTE-2: Login
// ROUTE-3: Get User
// ROUTE-3: Update User
// ROUTE-3: Delete User
/**

 */
userRouter.post("/register", [
    body("fname", "Please enter at least 2 characters in first name.").isLength({ min: 2 }),
    body("lname", "Please enter at least 2 characters in last name").isLength({
        min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
    body("phone", "Please Enter only 10 numbers").isLength({
        min: 10,
        max: 15,
    }),
], register);
// Login
userRouter.post("/login", [body("email", "Please Enter email correctly.").isEmail()], login);
// Get User
userRouter.get("/", checkUser, getUser);
// Update User
userRouter.put("/update", [
    body("fname", "Please enter at least 2 characters in first name.").isLength({
        min: 2,
    }),
    body("lname", "Please enter at least 2 characters in last name").isLength({
        min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("phone", "Please Enter only 10 numbers").isLength({
        min: 10,
        max: 10,
    }),
], checkUser, updateUser);
// Delete User
userRouter.delete("/delete", checkUser, deleteUser);
