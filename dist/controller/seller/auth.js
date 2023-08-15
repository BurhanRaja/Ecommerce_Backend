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
import bcrypt from "bcrypt";
import Seller from "../../model/Seller.js";
import validateReq from "../../utils/vaidation.js";
import configuration from "../../config/config.js";
// Seller Register
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { fname, lname, email, password } = req.body;
        let seller = yield Seller.findOne({ email: email });
        if (seller) {
            return res.status(400).send({
                success,
                error: "Seller already Exists.",
            });
        }
        const salt = yield bcrypt.genSalt(10);
        const securePassword = yield bcrypt.hash(password, salt);
        seller = yield Seller.create({
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
    }
    catch (error) {
        res.status(500).send({
            success: false,
            error: "Internal Server Error!",
        });
    }
});
// Seller Login
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { email, password } = req.body;
        const seller = yield Seller.findOne({ email: email });
        if (!seller) {
            return res.status(404).send({
                error: "Seller does not Exists.",
            });
        }
        const passwordCompare = yield bcrypt.compare(password, seller.password);
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
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
