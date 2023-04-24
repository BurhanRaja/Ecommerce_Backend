const express = require("express");
const checkSeller = require("../../middleware/checkSeller");
const {
  getInfo,
  createInfo,
  updateInfo,
  deleteInfo,
  getAllSellerInfo,
} = require("../../controller/seller/info");
const { body } = require("express-validator");

const router = express.Router();

router.get("/all/:parentid", getAllSellerInfo);

router.get("/", checkSeller, getInfo);

router.post(
  "/create",
  checkSeller,
  [
    body("phone", "Please enter at most 10 characters.").isLength({
      max: 10,
      min: 10,
    }),
  ],
  createInfo
);

router.put(
  "/update/:id",
  checkSeller,
  [
    body("phone", "Please enter at most 10 characters.").isLength({
      max: 10,
      min: 10,
    }),
  ],
  updateInfo
);

router.delete("/delete/:id", deleteInfo);

module.exports = router;
