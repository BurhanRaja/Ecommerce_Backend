const Seller = require("../../model/Seller");
const { validateReq } = require("../../utils/vaidation");
const bcrypt = require("bcrypt");

// Get Seller
exports.getSeller = async (req, res, next) => {
  let success = false;

  try {
    const seller = await Seller.findById(req.seller.id).select("-password");
    success = true;

    res.send({
      success,
      seller,
    });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, error: "Internal Server Occurred." });
  }
};

// Update Seller
exports.updateSeller = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const { fname, lname, email } = req.body;

    const updSeller = {};

    if (fname) updSeller.first_name = fname;
    if (lname) updSeller.last_name = lname;
    if (email) updSeller.email = email;

    let seller = await Seller.findOne({
      _id: req.seller.id,
    });

    if (!seller) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    seller = await Seller.findOneAndUpdate(
      { _id: req.seller.id },
      { $set: updSeller }
    );

    success = true;

    return res.status(200).send({
      success,
      seller,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Delete Seller
exports.deleteSeller = async (req, res, next) => {
  let success = false;

  try {
    let seller = await Seller.findById(req.seller.id);
    if (!seller) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    seller = await Seller.findOneAndDelete(req.seller.id, { $set: null });
    success = true;

    return res.status(200).send({
      success,
      message: "User Successfully Deleted.",
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error." });
  }
};
