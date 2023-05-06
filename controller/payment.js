const Razorpay = require("razorpay");
const crypto = require("crypto");
const { RAZORPAY_KEY, RAZORPAY_SECRET } = require("../config/config");

// Add Card
// exports.addCard = async (req, res) => {
//   let success = false;

//   validateReq(req, res);

//   try {
//     const {
//       cardNumber,
//       cardExpMonth,
//       cardExpYear,
//       cardName,
//       cardCVC,
//       cardType,
//     } = req.body;

//     if (!cardNumber && !cardExpMonth && !cardExpYear && !cardCVC) {
//       return res.status(400).send({
//         success,
//         message: "Please Provide all the relevant Information",
//       });
//     }

//     let userCard = await Cards.findOne({
//       user_id: req.user.id,
//     });

//     const today = new Date();
//     let exp_year = today.getFullYear().toString().split("").slice(2).join("");

//     if (cardExpMonth < today.getMonth() && cardExpYear < Number(exp_year)) {
//       return res.status(400).send({
//         success,
//         message: "Card is already Expired.",
//       });
//     }

//     if (userCard) {
//       await Cards.findOneAndUpdate(
//         {
//           user_id: req.user.id,
//         },
//         {
//           $push: {
//             cards: {
//               cardNumber,
//               cardExpMonth,
//               cardExpYear,
//               cardCVC,
//               cardName,
//               cardType,
//             },
//           },
//         }
//       );
//     } else {
//       await Cards.create({
//         user_id: req.user.id,
//         cards: [
//           {
//             cardNumber,
//             cardExpMonth,
//             cardExpYear,
//             cardCVC,
//             cardName,
//             cardType,
//           },
//         ],
//       });
//     }

//     success = true;
//     return res.status(200).send({
//       success,
//       message: "Successfully Card Added.",
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// // View All Cards
// exports.getAllCards = async (req, res) => {
//   let success = false;

//   try {
//     const savedCards = await Cards.findOne({
//       user_id: req.user.id,
//     });

//     success = true;

//     return res.status(200).send({
//       success,
//       cards: savedCards.cards,
//     });
//   } catch (err) {
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// // Update Card
// exports.updateCardDetails = async (req, res) => {
//   let success = false;

//   try {
//     const { cardName, cardExpMonth, cardExpYear } = req.body;
//     let cards = await Cards.findOne(
//       {
//         user_id: req.user.id,
//       },
//       {
//         cards: { $elemMatch: { _id: req.params.id } },
//       }
//     );

//     if (!cards.cards) {
//       return res.status(404).send({
//         success,
//         message: "Card not found.",
//       });
//     }

//     let updData = {};

//     if (cardName) updData["cardName"] = cardName;
//     if (cardExpMonth) updData["cardExpMonth"] = cardExpMonth;
//     if (cardExpYear) updData["cardExpYear"] = cardExpYear;

//     let user = await User.findOneAndUpdate(
//       {
//         user_id: req.user.id,
//         "cards._id": req.params.id,
//       },
//       {
//         $set: updData,
//       }
//     );

//     success = true;

//     return res.status(200).send({
//       success,
//       message: "Successfully Card updated",
//     });
//   } catch (err) {
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// // Delete Card
// exports.deleteCard = async (req, res) => {
//   let success = false;

//   try {
//     let cards = await Cards.findOne(
//       {
//         user_id: req.user.id,
//       },
//       {
//         cards: { $elemMatch: { _id: req.params.id } },
//       }
//     );

//     if (!cards.cards.length === 0) {
//       return res.status(404).send({
//         success,
//         message: "Card not found.",
//       });
//     }

//     cards = await Cards.findOneAndUpdate(
//       {
//         user_id: req.user.id,
//       },
//       {
//         $pull: {
//           cards: { _id: req.params.id },
//         },
//       }
//     );

//     success = true;

//     return res.status(200).send({
//       success,
//       message: "Successfully Card deleted",
//     });
//   } catch (err) {
//     return res.status(500).send({
//       success: false,
//       message: "Internal Server Error.",
//     });
//   }
// };

// Create Order
exports.createOrder = async (req, res) => {
  let success = false;

  try {
    const { amount } = req.body;

    let num = Math.ceil(Math.random() * 35);
    if (num < 30) {
      num += 1;
    }
    let reciept = Math.random().toString(num).substring(2);

    const instance = new Razorpay({
      key_id: RAZORPAY_KEY,
      key_secret: RAZORPAY_SECRET,
    });

    instance.orders.create(
      {
        amount: amount * 100,
        currency: "INR",
        receipt: reciept,
      },
      (err, data) => {
        if (err) {
          return res.status(400).send({
            success,
            message: "Unable to create Order.",
          });
        }

        success = true;
        return res.status(200).send({
          success,
          order: data,
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Verify Order
exports.verifyOrder = async (req, res) => {
  const success = false;
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const signature = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSig = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(signature)
      .digest("hex");

    if (razorpay_signature !== expectedSig) {
      return res.status(400).send({
        success,
        message: "Invalid Signature.",
      });
    }

    success = true;
    return res.status(200).send({
      success,
      message: "Payment Verified.",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
