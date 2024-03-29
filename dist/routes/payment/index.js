const { Router } = require("express");
const checkUser = require("../../middleware/checkUser");
const { 
// getAllCards,
// addCard,
// updateCardDetails,
// deleteCard,
createOrder, verifyOrder, } = require("../../controller/payment");
const { body } = require("express-validator");
const router = Router();
// router.get("/all", checkUser, getAllCards);
// router.post(
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
// router.put("/update/:id", checkUser, updateCardDetails);
// router.delete("/delete/:id", checkUser, deleteCard);
router.post("/create/order", checkUser, createOrder);
router.post("/verify/order", checkUser, verifyOrder);
module.exports = router;
export {};
