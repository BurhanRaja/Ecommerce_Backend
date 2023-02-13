const express = require("express");
const userAuth = require("../../controller/client/auth");
const router = express.Router();
const { body } = require("express-validator");

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
    body("phone", "Please Enter only 10 numbers").isLength({
      min: 10,
      max: 10,
    }),
  ],
  userAuth.register
);

router.post(
  "/login",
  [body("email", "Please Enter email correctly.").isEmail()],
  userAuth.login
);

module.exports = router;
