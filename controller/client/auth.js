const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../model/User");

// User Register
exports.register = async (req, res, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const { fname, lname, email, password, phone } = req.body;

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({
        success,
        message: "User already Exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    user = await User.create({
      first_name: fname,
      last_name: lname,
      email: email,
      password: securePassword,
      phone_number: phone,
    });

    let data = {
      user: {
        id: user.id,
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
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: "Internal Server Occurred." });
  }
};

// User Login
exports.login = async (req, res, next) => {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        error: "Invalid Credentials.",
      });
    }

    const passwordCompare = bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).send({
        error: "Invalid Credentials.",
      });
    }

    let data = {
      user: {
        id: user.id,
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
      .send({ success: false, message: "Internal Server Occurred." });
  }
};
