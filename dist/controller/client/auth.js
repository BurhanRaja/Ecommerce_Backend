var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import validateReq from "../../utils/vaidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../model/User.js";
import configuration from "../../config/config.js";
// User Register
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { fname, lname, email, password, phone } = req.body;
        let user = yield User.findOne({ email: req.body.email });
        if (user !== null) {
            return res.status(400).send({
                success,
                error: "User already Exists.",
            });
        }
        const salt = yield bcrypt.genSalt(10);
        const securePassword = yield bcrypt.hash(password, salt);
        user = yield User.create({
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
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
// User Login
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { email, password } = req.body;
        const user = yield User.findOne({ email: email });
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
    }
    catch (err) {
        res.status(500).send({ success: false, error: "Internal Server Error." });
    }
});
