import { Router } from "express";
import checkUser from "../middleware/checkUser.js";
import checkSeller from "../middleware/checkSeller.js";
import {
  getSingleOrder,
  getAllOrders,
  createOrder,
  getSellerOrders,
  updateOrder,
} from "../controller/order.js";

export const orderRouter = Router();

orderRouter.get("/all", checkUser, getAllOrders);

orderRouter.get("/:id", checkUser, getSingleOrder);

orderRouter.post("/create", checkUser, createOrder);

orderRouter.get("/seller/order", checkSeller, getSellerOrders);

orderRouter.put("/order/update/:", updateOrder);

