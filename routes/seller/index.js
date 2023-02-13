const express = require("express");
const sellerAuth = require("../../controller/seller/auth");
const { body } = require("express-validator");

const router = express.Router();


// fname, lname, email, password, admin


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


module.exports = router;