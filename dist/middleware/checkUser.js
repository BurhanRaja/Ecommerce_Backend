import jwt from "jsonwebtoken";
import configuration from "../config/config.js";
const checkUser = (req, res, next) => {
    let success = false;
    if (!req.headers.authorization) {
        return res.status(403).send({
            success,
            message: "No Token found.",
        });
    }
    const token = req === null || req === void 0 ? void 0 : req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            success,
            message: "Please authenticate with valid token",
        });
    }
    const data = jwt.verify(token, configuration.SECRET_KEY);
    req["user"] = data.user;
    next();
};
export default checkUser;
