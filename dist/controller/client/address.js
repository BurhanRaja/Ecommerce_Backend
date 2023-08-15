var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Useraddress from "../../model/Useraddress.js";
import validateReq from "../../utils/vaidation.js";
// Get UserAddress
export const getUserAdresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let success = false;
    try {
        let userAddress = yield Useraddress.find({ user_id: req.user.id });
        success = true;
        return res.status(200).send({
            success,
            userAddress: (_a = userAddress[0]) === null || _a === void 0 ? void 0 : _a.addresses,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Create First User Address
export const createUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { address_line_1, address_line_2, city, state, postal_code, country, address_type, } = req.body;
        let address = yield Useraddress.findOne({
            user_id: req.user.id,
        });
        if (!address) {
            address = yield Useraddress.create({
                user_id: req.user.id,
                addresses: [
                    {
                        address_line_1,
                        address_line_2,
                        city,
                        state,
                        country,
                        address_type,
                        postal_code,
                    },
                ],
            });
        }
        else {
            address = yield Useraddress.findOneAndUpdate({ _id: address._id, user_id: req.user.id }, {
                $push: {
                    addresses: {
                        address_line_1,
                        address_line_2,
                        city,
                        state,
                        postal_code,
                        country,
                        address_type,
                    },
                },
            });
        }
        success = true;
        return res.status(200).send({
            success,
            address,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Get Single Address
export const getSingleAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true;
    try {
        let address = yield Useraddress.findOne({
            user_id: req.user.id,
            "addresses._id": req.params.id,
        }, { addresses: { $elemMatch: { _id: req.params.id } } });
        success = true;
        return res.status(200).send({
            success,
            address: address === null || address === void 0 ? void 0 : address.addresses[0],
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Update Address
export const updateUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { address_line_1, address_line_2, city, postal_code, country, address_type, } = req.body;
        let updUserAdd = {
            address_line_1,
            address_line_2,
            city,
            postal_code,
            country,
            address_type,
        };
        const diffuserAddress = yield Useraddress.find({
            user_id: req.user.id,
        });
        if (!diffuserAddress) {
            res.status(404).send({ success, message: "404 Not Found" });
        }
        const userAddress = yield Useraddress.findOneAndUpdate({
            user_id: req.user.id,
            "addresses._id": req.params.id,
        }, { $set: { "addresses.$": updUserAdd } });
        success = true;
        return res.status(200).send({
            success,
            userAddress,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Delete Address
export const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = true;
    try {
        const diffaddress = yield Useraddress.find({ user_id: req.user.id });
        if (!diffaddress) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        const address = yield Useraddress.findOneAndUpdate({
            user_id: req.user.id,
        }, { $pull: { addresses: { _id: req.params.id } } });
        success = true;
        return res.status(200).send({
            success,
            address,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
