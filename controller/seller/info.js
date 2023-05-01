const Sellerinfo = require("../../model/Sellerinfo");
const { validateReq } = require("../../utils/vaidation");

// Get Info
exports.getInfo = async (req, res, next) => {
  let success = false;

  try {
    let info = await Sellerinfo.findOne({ seller_id: req.seller.id });

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

exports.getAllSellerInfo = async (req, res) => {
  let success = false;

  try {
    let sellerinfo = await Sellerinfo.find({
      company_type: req.params.parentid,
    });

    success = true;

    return res.status(200).send({
      success,
      companies: sellerinfo,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Create Info
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

    let info = await Sellerinfo.findOne({
      company_name,
      company_website,
      company_type,
    });

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
      seller_id: req.seller.id,
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

// Update Info
exports.updateInfo = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      company_name,
      company_type,
      company_website,
      phone,
    } = req.body;

    let updInfo = {};

    if (company_name) updInfo.company_name = company_name;
    if (company_type) updInfo.company_type = company_type;
    if (company_website) updInfo.company_website = company_website;
    if (phone) updInfo.phone = phone;

    let info = await Sellerinfo.findById(req.params.id);

    if (!info) {
      return res.status(404).send({
        success,
        message: "404 Not Found.",
      }); 
    }

    info = await Sellerinfo.findByIdAndUpdate(req.params.id, { $set: updInfo });

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

// Delete Info
exports.deleteInfo = async (req, res, next) => {
  let success = false;

  try {
    let info = await Sellerinfo.findById(req.params.id);

    if (!info) {
      return res.status(404).send({ success, message: "404 Not Found" });
    }

    info = await Sellerinfo.findByIdAndDelete(req.params.id, { $set: null });

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
