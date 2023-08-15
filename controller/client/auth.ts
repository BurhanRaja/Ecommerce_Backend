import validateReq from "../../utils/vaidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../model/User.js";
import configuration from "../../config/config.js";
import { Response } from "express";
import { UserAuthRequest } from "../../utils/defineauth.js";

// User Register
export const register = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { fname, lname, email, password, phone } = req.body;

    let user = await User.findOne({ email: req.body.email });

    if (user !== null) {
      return res.status(400).send({
        success,
        error: "User already Exists.",
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

    let privateKey = configuration.SECRET_KEY;
    let authToken = jwt.sign(data, privateKey);

    success = true;

    return res.status(200).send({
      success,
      token: authToken,
      message: "Successfully Registered!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};

// User Login
export const login = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        success,
        error: "User not found.",
      });
    }

    const passwordCompare = bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).send({
        success,
        error: "Invalid Credentials.",
      });
    }

    let data = {
      user: {
        id: user.id,
      },
    };

    let privateKey = configuration.SECRET_KEY;
    let authToken = jwt.sign(data, privateKey);

    success = true;

    return res.status(201).send({
      success,
      token: authToken,
      message: "Successfully Logged In!",
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};
