const { STRIPE_SECRET } = require("../config/config");
const Cards = require("../model/Cards");
const User = require("../model/User");
const { validateReq } = require("../utils/vaidation");
const stripe = require("stripe")(STRIPE_SECRET);

// Add Card
exports.addCard = async (req, res) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardName,
      cardCVC,
      cardType,
    } = req.body;

    if (!cardNumber && !cardExpMonth && !cardExpYear && !cardCVC) {
      return res.status(400).send({
        success,
        message: "Please Provide all the relevant Information",
      });
    }

    let userCard = await Cards.findOne({
      user_id: req.user.id,
    });

    const today = new Date();
    let exp_year = today.getFullYear().toString().split("").slice(2).join("");

    if (cardExpMonth < today.getMonth() && cardExpYear < Number(exp_year)) {
      return res.status(400).send({
        success,
        message: "Card is already Expired.",
      });
    }

    if (userCard) {
      await Cards.findOneAndUpdate(
        {
          user_id: req.user.id,
        },
        {
          $push: {
            cards: {
              cardNumber,
              cardExpMonth,
              cardExpYear,
              cardCVC,
              cardName,
              cardType,
            },
          },
        }
      );
    } else {
      await Cards.create({
        user_id: req.user.id,
        cards: [
          {
            cardNumber,
            cardExpMonth,
            cardExpYear,
            cardCVC,
            cardName,
            cardType,
          },
        ],
      });
    }

    success = true;
    return res.status(200).send({
      success,
      message: "Successfully Card Added.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// View All Cards
exports.getAllCards = async (req, res) => {
  let success = false;

  try {
    const savedCards = await Cards.findOne({
      user_id: req.user.id,
    });

    success = true;

    return res.status(200).send({
      success,
      cards: savedCards.cards,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Update Card
exports.updateCardDetails = async (req, res) => {
  let success = false;

  try {
    const { cardName, cardExpMonth, cardExpYear } = req.body;
    let cards = await Cards.findOne(
      {
        user_id: req.user.id,
      },
      {
        cards: { $elemMatch: { _id: req.params.id } },
      }
    );

    if (!cards.cards) {
      return res.status(404).send({
        success,
        message: "Card not found.",
      });
    }

    let updData = {};

    if (cardName) updData["cardName"] = cardName;
    if (cardExpMonth) updData["cardExpMonth"] = cardExpMonth;
    if (cardExpYear) updData["cardExpYear"] = cardExpYear;

    let user = await User.findOneAndUpdate(
      {
        user_id: req.user.id,
        "cards._id": req.params.id,
      },
      {
        $set: updData,
      }
    );

    success = true;

    return res.status(200).send({
      success,
      message: "Successfully Card updated",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Delete Card
exports.deleteCard = async (req, res) => {
  let success = false;

  try {
    let cards = await Cards.findOne(
      {
        user_id: req.user.id,
      },
      {
        cards: { $elemMatch: { _id: req.params.id } },
      }
    );

    if (!cards.cards.length === 0) {
      return res.status(404).send({
        success,
        message: "Card not found.",
      });
    }

    cards = await Cards.findOneAndUpdate(
      {
        user_id: req.user.id,
      },
      {
        $pull: {
          cards: { _id: req.params.id },
        },
      }
    );

    success = true;

    return res.status(200).send({
      success,
      message: "Successfully Card deleted",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Create Payment
exports.createPayment = async (req, res) => {
  let success = false;

  try {
    const {
      amount,
      cardId,
      oneTime,
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCVC,
      cardName,
    } = req.body;

    let user = await User.findOne({
      _id: req.user.id,
    });

    if (!cardNumber && !cardExpMonth && !cardExpYear && !cardCVC) {
      return res.status(400).send({
        success,
        message: "Please Provide all the relevant Information",
      });
    }

    let cardToken;
    let charge;

    if (oneTime) {
      cardToken = await stripe.tokens.create({
        card: {
          number: cardNumber,
          exp_month: cardExpMonth,
          exp_year: cardExpYear,
          cvc: cardCVC,
          name: cardName,
        },
      });

      charge = await stripe.charges.create({
        amount,
        currency: "inr",
        source: cardToken.id,
        receipt_email: user.email,
        description: `Stripe Charge of amount ${amount} for One Time Payment by ${
          user.first_name + " " + user.last_name
        }`,
      });
    } else {
      let card = await Cards.findOne(
        {
          user_id: req.user.id,
          "cards._id": cardId,
        },
        {
          "cards._id": cardId,
        }
      );

      card = card.cards[0];

      cardToken = await stripe.tokens.create({
        card: {
          number: card.cardNumber,
          exp_month: card.cardExpMonth,
          exp_year: card.cardExpYear,
          cvc: card.cardCVC,
          name: card.cardName,
        },
      });

      charge = await stripe.charges.create({
        amount,
        currency: "inr",
        source: cardToken.id,
        receipt_email: user.email,
        description: `Stripe Charge of amount ${amount} for One Time Payment by ${
          user.first_name + " " + user.last_name
        }`,
      });
    }

    if (charge.status === "succeeded") {
      success = true;
      return res.status(200).send({
        success,
        message: "Payment Successful",
        chargeStatus: charge,
      });
    } else {
      return res.status(400).send({
        success,
        message: "Payment Failed",
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
