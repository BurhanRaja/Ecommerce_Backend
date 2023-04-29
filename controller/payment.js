const { STRIPE_SECRET } = require("../../config/config");
const Cards = require("../model/Cards");
const User = require("../model/User");
const stripe = require("stripe")(STRIPE_SECRET);

// Add Card
exports.addCard = async (req, res) => {
  let success = false;

  try {
    const { cardNumber, cardExpMonth, cardExpYear, cardName, cardCVC } =
      req.body;

    if (!cardNumber && !cardExpMonth && !cardExpYear && !cardCVC) {
      return res.status(400).send({
        success,
        message: "Please Provide all the relevant Information",
      });
    }
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        name: cardName,
      },
    });

    const card = await stripe.customers.createSource({
      source: `${cardToken.id}`,
    });

    let userCard = await Cards.findOne({
      _id: req.user.id,
    });

    if (userCard) {
      await Cards.findOneAndUpdate(
        {
          _id: req.user.id,
        },
        {
          $push: {
            cardsId: card.id,
          },
        }
      );
    } else {
      await Cards.create({
        user_id: req.user.id,
        cardsId: [card.id],
      });
    }

    success = true;
    return res.status(200).send({
      success,
      message: "Successfully Card Added.",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// View All Cards
exports.viewAllCards = async (req, res) => {
  let success = false;
  // let cards = [];
  try {
    let user = await User.findOne({
      _id: req.user.id,
    });

    const savedCards = await stripe.customers.listSources(user.custormer_id, {
      object: "card",
    });

    success = true;

    return res.status(200).send({
      success,
      cards: savedCards.data,
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
        _id: req.user.id,
      },
      {
        cardsId: { $in: [req.params.cardId] },
      }
    );

    if (!cards.cardsId) {
      return res.status(404).send({
        success,
        message: "Card not found.",
      });
    }

    let user = await User.findOne({
      _id: req.user.id,
    });

    const card = await stripe.customers.updateSource(
      user.custormer_id,
      req.params.cardId,
      {
        name: cardName,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
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
        cardsId: { $in: [req.params.cardId] },
      }
    );

    if (!cards.cardsId.length === 0) {
      return res.status(404).send({
        success,
        message: "Card not found.",
      });
    }

    let user = await User.findOne({
      _id: req.user.id,
    }); 

    cards = await Cards.findOneAndUpdate(
      {
        user_id: req.user.id,
      },
      {
        $pull: {
          cardsId: req.params.cardId,
        },
      }
    );

    const deleteCard = await stripe.customers.deleteSource(
      user.custormer_id,
      req.params.cardId
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
  const { amount, cardId, oneTime } = req.body;

  try {
    let user = await User.findOne({
      _id: req.user.id,
    });
    
    if (oneTime) {
      const { cardNumber, cardExpMonth, cardExpYear, cardCVC, cardName } =
        req.body;

      if (!cardNumber && !cardExpMonth && !cardExpYear && !cardCVC) {
        return res.status(400).send({
          success,
          message: "Please Provide all the relevant Information",
        });
      }

      const cardToken = await stripe.tokens.create({
        card: {
          number: cardNumber,
          exp_month: cardExpMonth,
          exp_year: cardExpYear,
          cvc: cardCVC,
          name: cardName,
        },
      });

      const charge = await stripe.charges.create({
        amount,
        currency: "inr",
        source: cardToken.id,
        receipt_email: user.email,
        description: `Stripe Charge of amount ${amount} for One Time Payment by ${
          user.first_name + " " + user.last_name
        }`,
        customer: user.custormer_id,
      });

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
    } else {
      const charge = await stripe.charges.create({
        amount,
        currency: "inr",
        card: cardId,
        receipt_email: user.email,
        description: `Stripe Charge of amount ${amount} for One Time Payment by ${
          user.first_name + " " + user.last_name
        }`,
        customer: user.custormer_id,
      });
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
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
