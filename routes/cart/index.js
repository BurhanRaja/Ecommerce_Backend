const { Router } = require("express");
const checkUser = require("../../middleware/checkUser");
const {
  getCart,
  addToCart,
  removeFromCart,
  addTotal,
} = require("../../controller/cart");

const router = Router();

// ROUTE-1: Get Cart
router.get("/", checkUser, getCart);

// ROUTE-2: Add to Cart
router.post("/addtocart", checkUser, addToCart);

// ROUTE-3: Remove from Cart
router.delete("/remove/:id/:productid", checkUser, removeFromCart);

// ROUTE-4: Add total
router.put("/add/total", addTotal);

module.exports = router;
