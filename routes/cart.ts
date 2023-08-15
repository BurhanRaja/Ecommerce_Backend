import { Router } from "express";
import checkUser from "../middleware/checkUser.js";
import {
  getCart,
  addToCart,
  addTotal,
  removeFromCart,
} from "../controller/cart.js";

export const cartRouter = Router();

// ROUTE-1: Get Cart
cartRouter.get("/", checkUser, getCart);

// ROUTE-2: Add to Cart
cartRouter.post("/addtocart", checkUser, addToCart);

// ROUTE-3: Remove from Cart
cartRouter.delete("/remove/:id/:itemid", checkUser, removeFromCart);

// ROUTE-4: Add total
cartRouter.put("/add/total", checkUser, addTotal);
