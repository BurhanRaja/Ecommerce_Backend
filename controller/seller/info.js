const Sellerinfo = require("../../model/Sellerinfo");
const { validateReq } = require("../../utils/vaidation");

exports.getInfo = async (req, res, next) => {
  let success = false;

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
  let success = false;

  validateReq(req, res);

  try {
    // Add File Support in identity proof
    const {
      company_name,
      company_type,
      company_website,
      phone,
      identity_proof,
      tax_info,
    } = req.body;

    let info = Sellerinfo.find({ company_name: company_name });

    if (info) {
      return res
        .status(400)
        .send({ success, message: "Company Already Exists." });
    }

    info = await Sellerinfo.create({
      company_name,
      company_type,
      company_website,
      phone,
      identity_proof,
      tax_info,
    });

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

exports.updateInfo = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      company_name,
      company_type,
      company_website,
      phone,
      identity_proof,
      tax_info,
    } = req.body;

    let updInfo = {};

    if (company_name) updInfo.company_name = company_name;
    if (company_type) updInfo.company_type = company_type;
    if (company_website) updInfo.company_website = company_website;
    if (phone) updInfo.phone = phone;
    if (identity_proof) updInfo.identity_proof = identity_proof;
    if (tax_info) updInfo.tax_info = tax_info;

    let info = await Sellerinfo.findById(req.params.id);

    if (!info) {
      return res.status(404).send({
        success,
        message: "404 Not Found.",
      });
    }

    info = await Sellerinfo.findByIdAndUpdate(
      req.params.id,
      { $set: updInfo },
      { new: true }
    );

    
  } catch (err) {}
};
