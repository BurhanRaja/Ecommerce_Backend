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
import User from "../../model/User.js";
// Get User
export const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const user = yield User.findById(req.user.id).select("-password");
        success = true;
        return res.send({
            success,
            user,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Occurred." });
    }
});
// Update User
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { fname, lname, email, phone } = req.body;
        const updUser = {};
        if (fname)
            updUser.first_name = fname;
        if (lname)
            updUser.last_name = lname;
        if (email)
            updUser.email = email;
        if (phone)
            updUser.phone_number = Number(phone);
        let user = yield User.findOne({ _id: req.user.id, email: email });
        if (!user) {
            return res.status(404).send({
                success,
                error: "User doesn't Exists.",
            });
        }
        user = yield User.findOneAndUpdate({ _id: req.user.id }, { $set: updUser }, { new: true });
        success = true;
        return res.status(200).json({
            success,
            message: "User Successfully Updated.",
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Occurred." });
    }
});
// Delete User
export const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let user = yield User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ success, error: "404 Not Found." });
        }
        user = yield User.findOneAndDelete(req.user.id, { $set: null });
        success = true;
        return res.status(200).send({
            success,
            message: "User Successfully Deleted.",
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, error: "Internal Server Error." });
    }
});
