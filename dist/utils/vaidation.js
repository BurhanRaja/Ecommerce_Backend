import { validationResult } from "express-validator";
const validateReq = (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).send({ success: false, error: error.array() });
    }
};
export default validateReq;
