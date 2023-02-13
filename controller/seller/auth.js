const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Seller = require("../../model/Seller");

// Seller Register
exports.register = async (req, res, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const { fname, lname, email, password, admin } = req.body;

    let seller = await Seller.findOne({ email: email });
    if (seller) {
      return res.status(400).send({
        success,
        error: "Seller already Exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    seller = await Seller.create({
      first_name: fname,
      last_name: lname,
      email: email,
      password: securePassword,
      admin: admin,
    });

    let data = {
      seller: {
        id: seller.id,
      },
    };

    let privateKey = process.env.SECRET_KEY;
    let authToken = jwt.sign(data, privateKey);

    success = true;

    return res.status(201).send({
      success,
      token: authToken,
      message: "Successfully Registered!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error!",
    });
  }
};

// Seller Login
exports.login = async (req, res, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email: email });

    if (!seller) {
      return res.status(400).send({
        error: "Invalid Credentials.",
      });
    }

    const passwordCompare = bcrypt.compare(password, seller.password);
    if (!passwordCompare) {
      return res.status(400).send({
        error: "Invalid Credentials.",
      });
    }

    let data = {
      seller: {
        id: seller.id,
      },
    };

    let privateKey = process.env.SECRET_KEY;
    let authToken = jwt.sign(data, privateKey);

    success = true;

    return res.status(201).send({
      success,
      token: authToken,
      message: "Successfully Logged In!",
    });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, error: "Internal Server Occurred." });
  }
};
