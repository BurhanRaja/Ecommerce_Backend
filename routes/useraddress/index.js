const express = require("express");
const uadd = require("../../controller/client/address");
const checkUser = require("../../middleware/checkUser");
const { body } = require("express-validator");

const router = express.Router();

router.get("/", checkUser, uadd.getUserAdresses);

router.post(
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
  uadd.createUserAddress
);

router.get("/:id", checkUser, uadd.getSingleAddress);

router.put(
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
  uadd.updateUserAddress
);

router.delete("/delete/:id", checkUser, uadd.deleteAddress);

module.exports = router;
