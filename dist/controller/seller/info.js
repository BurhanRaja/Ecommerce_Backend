var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Sellerinfo from "../../model/Sellerinfo.js";
import validateReq from "../../utils/vaidation.js";
// Get Info
export const getInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let info = yield Sellerinfo.findOne({ seller_id: req.seller.id });
        if (!info) {
            return res.status(404).send({ success, message: "404 Not Found." });
        }
        success = true;
        return res.status(200).send({
            success,
            info,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
export const getAllSellerInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let sellerinfo = yield Sellerinfo.find({
            company_type: req.params.parentid,
        });
        success = true;
        return res.status(200).send({
            success,
            companies: sellerinfo,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Create Info
export const createInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        // Add File Support in identity proof
        const { company_name, company_type, company_website, phone, identity_proof, tax_info, } = req.body;
        let info = yield Sellerinfo.findOne({
            company_name,
            company_website,
            company_type,
        });
        if (info) {
            return res
                .status(400)
                .send({ success, message: "Company Already Exists." });
        }
        info = yield Sellerinfo.create({
            company_name,
            company_type,
            company_website,
            phone,
            identity_proof,
            tax_info,
            seller_id: req.seller.id,
        });
        success = true;
        return res.status(200).send({
            success,
            info,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Update Info
export const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    validateReq(req, res);
    try {
        const { company_name, company_type, company_website, phone, } = req.body;
        let updInfo = {};
        if (company_name)
            updInfo.company_name = company_name;
        if (company_type)
            updInfo.company_type = company_type;
        if (company_website)
            updInfo.company_website = company_website;
        if (phone)
            updInfo.phone = phone;
        let info = yield Sellerinfo.findById(req.params.id);
        if (!info) {
            return res.status(404).send({
                success,
                message: "404 Not Found.",
            });
        }
        info = yield Sellerinfo.findByIdAndUpdate(req.params.id, { $set: updInfo });
        success = true;
        return res.status(200).send({
            success,
            info,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
// Delete Info
export const deleteInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let info = yield Sellerinfo.findById(req.params.id);
        if (!info) {
            return res.status(404).send({ success, message: "404 Not Found" });
        }
        info = yield Sellerinfo.findByIdAndDelete(req.params.id, { $set: null });
        success = true;
        return res.status(200).send({
            success,
            info,
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error." });
    }
});
