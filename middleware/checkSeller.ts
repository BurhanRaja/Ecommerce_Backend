import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import configuration from "../config/config.js";
import { SellerAuthRequest } from "../utils/defineauth.js";
import Sellerinfo from "../model/Sellerinfo.js";

interface JwtPayload {
  seller: {
    id: string;
  };
}

const checkSeller = async (
  req: SellerAuthRequest,
  res: Response,
  next: NextFunction
) => {
  let success = false;

  if (!req.headers.authorization) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  const data = jwt.verify(token, configuration.SECRET_KEY) as JwtPayload;

  let sellerinfo = await Sellerinfo.findOne({ seller_id: data.seller.id });

  let seller = {
    id: data.seller.id,
    sellerinfo,
  };

  req.seller = seller;

  next();
};

export default checkSeller;
