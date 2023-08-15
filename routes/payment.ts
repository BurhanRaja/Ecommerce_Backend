import { Router } from "express";
import checkUser from "../middleware/checkUser.js";
import { createOrder, verifyOrder } from "../controller/payment.js";

export const paymentRouter = Router();

// paymentRouter.get("/all", checkUser, getAllCards);

// paymentRouter.post(
//   "/create",
//   [
//     body("cardNumber", "Please Enter a correct CardNumber").isCreditCard(),
//     body("cardCVC", "Please Enter a correct cardCVC").isLength({
//       min: 3,
//       max: 3,
//     }),
//   ],
//   checkUser,
//   addCard
// );

// paymentRouter.put("/update/:id", checkUser, updateCardDetails);

// paymentRouter.delete("/delete/:id", checkUser, deleteCard);

paymentRouter.post("/create/order", checkUser, createOrder);

paymentRouter.post("/verify/order", checkUser, verifyOrder);

