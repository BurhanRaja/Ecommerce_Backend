import { Router } from "express";
import {
  getUserAdresses,
  createUserAddress,
  deleteAddress,
  getSingleAddress,
  updateUserAddress,
} from "../controller/client/address.js";
import checkUser from "../middleware/checkUser.js";
import { body } from "express-validator";

export const userAddressRouter = Router();

userAddressRouter.get("/", checkUser, getUserAdresses);

userAddressRouter.post(
  "/create",
  [
    body("address_line_1", "Please enter at least 10 characters.").isLength({
      min: 10,
    }),
    body("address_line_2", "Please enter at least 10 characters.").isLength({
      min: 10,
    }),
    body("city", "Please enter at least 3 characters.").isLength({ min: 3 }),
    body("country", "Please enter at least 3 characters.").isLength({ min: 3 }),
    body("state", "Please enter at least 3 characters.").isLength({ min: 3 }),
  ],
  checkUser,
  createUserAddress
);

userAddressRouter.get("/:id", checkUser, getSingleAddress);

userAddressRouter.put(
  "/update/:id",
  [
    body("address_line_1", "Please enter at least 10 characters.").isLength({
      min: 10,
    }),
    body("address_line_2", "Please enter at least 10 characters.").isLength({
      min: 10,
    }),
    body("city", "Please enter at least 3 characters.").isLength({ min: 3 }),
    body("country", "Please enter at least 3 characters.").isLength({ min: 3 }),
    body("state", "Please enter at least 3 characters.").isLength({ min: 3 }),
  ],
  checkUser,
  updateUserAddress
);

userAddressRouter.delete("/delete/:id", checkUser, deleteAddress);
