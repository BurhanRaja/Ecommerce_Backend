const express = require("express");
const sellerAuth = require("../../controller/seller/auth");
const product = require("../../controller/product");
const { body } = require("express-validator");
const checkSeller = require("../../middleware/checkSeller");
const {
  getSeller,
  updateSeller,
  deleteSeller,
} = require("../../controller/seller/seller");

const router = express.Router();

// ROUTE-1: Register
router.post(
  "/register",
  [
    body("fname", "Please enter at least 2 characters in first name.").isLength(
      { min: 2 }
    ),
    body("lname", "Please enter at least 2 characters in last name").isLength({
      min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
  ],
  sellerAuth.register
);

// ROUTE-2: Login
router.post(
  "/login",
  [
    body("email", "Please enter correct email.").isEmail(),
    body("password", "Please enter a strong password").isLength({ min: 5 }),
  ],
  sellerAuth.login
);

router.get("/", checkSeller, getSeller);

router.put(
  "/update",
  checkSeller,
  [
    body("fname", "Please enter at least 2 characters in first name.").isLength(
      { min: 2 }
    ),
    body("lname", "Please enter at least 2 characters in last name").isLength({
      min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
  ],
  updateSeller
);

router.delete("/delete", checkSeller, deleteSeller);

module.exports = router;
