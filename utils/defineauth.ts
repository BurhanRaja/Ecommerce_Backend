import { Request } from "express";

export interface UserAuthRequest extends Request {
  user?: any;
}

export interface SellerAuthRequest extends Request {
  seller?: any;
}
