import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import configuration from "../config/config.js";
import { UserAuthRequest } from "../utils/defineauth.js";

interface JwtPayload {
  user: {
    id: string;
  };
}

const checkUser = (req: UserAuthRequest, res: Response, next: NextFunction) => {
  let success = false;
  if (!req.headers.authorization) {
    return res.status(403).send({
      success,
      message: "No Token found.",
    });
  }

  const token = req?.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  const data = jwt.verify(token, configuration.SECRET_KEY) as JwtPayload;
  req["user"] = data.user;

  next();
};

export default checkUser;
