const { Router } = require("express");
import checkUser from "../../middleware/checkUser.js";
const { getCart, addToCart, removeFromCart, addTotal, } = require("../../controller/cart");
const router = Router();
// ROUTE-1: Get Cart
router.get("/", checkUser, getCart);
// ROUTE-2: Add to Cart
router.post("/addtocart", checkUser, addToCart);
// ROUTE-3: Remove from Cart
router.delete("/remove/:id/:itemid", checkUser, removeFromCart);
// ROUTE-4: Add total
router.put("/add/total", checkUser, addTotal);
module.exports = router;
