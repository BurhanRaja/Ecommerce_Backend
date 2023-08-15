import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Seller from "../../model/Seller.js";
import validateReq from "../../utils/vaidation.js";
import configuration from "../../config/config.js";
import { Response } from "express";
import { SellerAuthRequest } from "../../utils/defineauth.js";

// Seller Register
export const register = async (req: SellerAuthRequest, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { fname, lname, email, password } = req.body;

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
    });

    let data = {
      seller: {
        id: seller.id,
      },
    };

    let privateKey = configuration.SECRET_KEY;
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
export const login = async (req: SellerAuthRequest, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email: email });

    if (!seller) {
      return res.status(404).send({
        error: "Seller does not Exists.",
      });
    }

    const passwordCompare = await bcrypt.compare(password, seller.password);
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
