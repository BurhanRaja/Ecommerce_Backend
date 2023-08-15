import { Router } from "express";
import checkSeller from "../middleware/checkSeller.js";
import {
  getAllSellerOrder,
  getSingleSellerOrder,
  getSellerOrderCount,
} from "../controller/sellerorder.js";

export const sellerOrderRouter = Router();

sellerOrderRouter.get("/all", checkSeller, getAllSellerOrder);

sellerOrderRouter.get("/order/count", checkSeller, getSellerOrderCount);

sellerOrderRouter.get("/:id", checkSeller, getSingleSellerOrder);
