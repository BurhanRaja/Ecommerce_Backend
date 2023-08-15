var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import configuration from "../config/config.js";
import Sellerinfo from "../model/Sellerinfo.js";
const checkSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const data = jwt.verify(token, configuration.SECRET_KEY);
    let sellerinfo = yield Sellerinfo.findOne({ seller_id: data.seller.id });
    let seller = {
        id: data.seller.id,
        sellerinfo,
    };
    req.seller = seller;
    next();
});
export default checkSeller;
