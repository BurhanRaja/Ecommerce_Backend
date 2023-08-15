var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Seller from "../../model/Seller.js";
import validateReq from "../../utils/vaidation.js";
// Get Seller
export const getSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const seller = yield Seller.findById(req.seller.id).select("-password");
        success = true;
        res.send({
            success,
            seller,
        });
    }
    catch (err) {
        res
            .status(500)
            .send({ success: false, error: "Internal Server Occurred." });
    }
});
// Update Seller
export const updateSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { fname, lname, email } = req.body;
        const updSeller = {};
        if (fname)
            updSeller.first_name = fname;
        if (lname)
            updSeller.last_name = lname;
        if (email)
            updSeller.email = email;
        let seller = yield Seller.findOne({
            _id: req.seller.id,
        });
        if (!seller) {
            return res.status(404).send({ success, error: "404 Not Found." });
        }
        seller = yield Seller.findOneAndUpdate({ _id: req.seller.id }, { $set: updSeller });
        success = true;
        return res.status(200).send({
            success,
            seller,
        });
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error.",
        });
    }
});
// Delete Seller
export const deleteSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let seller = yield Seller.findById(req.seller.id);
        if (!seller) {
            return res.status(404).send({ success, error: "404 Not Found." });
        }
        seller = yield Seller.findOneAndDelete(req.seller.id, { $set: null });
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
