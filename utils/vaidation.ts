import { validationResult } from "express-validator";

import { Response, Request } from "express";

const validateReq = (req: Request, res: Response) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).send({ success: false, error: error.array() });
  }
};

export default validateReq;
