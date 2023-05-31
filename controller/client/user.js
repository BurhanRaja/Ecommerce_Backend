const User = require("../../model/User");
const bcrypt = require("bcrypt");
const { validateReq } = require("../../utils/vaidation");

// Get User
exports.getUser = async (req, res, next) => {
  let success = false;

  try {
    const user = await User.findById(req.user.id).select("-password");

    success = true;
    return res.send({
      success,
      user,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Occurred." });
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const { fname, lname, email, phone } = req.body;

    const updUser = {};

    if (fname) updUser.first_name = fname;
    if (lname) updUser.last_name = lname;
    if (email) updUser.email = email;
    if (phone) updUser.phone_number = phone;

    let user = await User.findOne({ _id: req.user.id, email: email });
    if (!user) {
      return res.status(404).send({
        success,
        error: "User doesn't Exists.",
      });
    }

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: updUser },
      { new: true }
    );

    success = true;

    return res.status(200).json({
      success,
      message: "User Successfully Updated.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Occurred." });
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  let success = false;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    user = await User.findOneAndDelete(req.user.id, { $set: null });

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
