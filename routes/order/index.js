const { Router } = require("express");
const checkUser = require("../../middleware/checkUser");
const checkSeller = require("../../middleware/checkSeller");
const {
  getSingleOrder,
  getAllOrders,
  createOrder,
  getSellerOrders,
} = require("../../controller/order");

const router = Router();

router.get("/all", checkUser, getAllOrders);

router.get("/:id", checkUser, getSingleOrder);

router.post("/create", checkUser, createOrder);

router.get("/seller/order", checkSeller, getSellerOrders);

module.exports = router;