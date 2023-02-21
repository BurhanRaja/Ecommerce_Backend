const Sellerinfo = require("../../model/Sellerinfo");
const { validateReq } = require("../../utils/vaidation");

exports.getInfo = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    let info = Sellerinfo.findById(req.seller.id);

    if (!info) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    success = true;

    return res.status(200).send({
      success,
      info,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};


exports.createInfo = async (req, res, next) => {
    
}