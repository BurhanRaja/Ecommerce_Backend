const express = require("express");
const userAuth = require("../../controller/client/auth");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../../controller/client/user");
const { body } = require("express-validator");
const checkUser = require("../../middleware/checkUser");

const router = express.Router();

// ROUTE-1: Regitser
// ROUTE-2: Login
// ROUTE-3: Get User
// ROUTE-3: Update User
// ROUTE-3: Delete User

/** 

 */

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
      max: 15,
    }),
  ],
  userAuth.register
);

// Login
router.post(
  "/login",
  [body("email", "Please Enter email correctly.").isEmail()],
  userAuth.login
);

// Get User
router.get("/", checkUser, getUser);

// Update User
router.put(
  "/update",
  [
    body("fname", "Please enter at least 2 characters in first name.").isLength(
      {
        min: 2,
      }
    ),
    body("lname", "Please enter at least 2 characters in last name").isLength({
      min: 2,
    }),
    body("email", "Please enter correct email.").isEmail(),
    body("phone", "Please Enter only 10 numbers").isLength({
      min: 10,
      max: 10,
    }),
  ],
  checkUser,
  updateUser
);

// Delete User
router.delete("/delete", checkUser, deleteUser);

module.exports = router;
