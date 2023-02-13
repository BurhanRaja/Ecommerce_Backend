const Seller = require("../../model/Seller");

// Get Seller
exports.getUser = async (req, res, next) => {
  let success = false;

  try {
    const sellerId = req.body.id;
    const seller = Seller.findById(sellerId).select("-password");
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
exports.updateUser = async (req, res, next) => {
  let success = false;
  try {
    const { fname, lname, email, password, admin } = req.body;
    const updSeller = {};

    if (fname) updSeller.fname = fname;
    if (lname) updSeller.lname = lname;
    if (email) updSeller.email = email;
    if (password) updSeller.password = password;
    if (admin) updSeller.admin = admin;

    let seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { $set: updSeller },
      { new: true }
    );
    success = true;

    res.status(200).send({
      success,
      seller,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Delete Seller
exports.deleteUser = async (req, res, next) => {
  let success = false;

  try {
    let seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    seller = await Seller.findOneAndDelete(req.params.id, { $set: null });
    success = true;

    res.status(200).send({
      success,
      message: "User Successfully Deleted.",
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};
