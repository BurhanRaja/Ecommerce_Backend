const User = require("../../model/User");
const bcrypt = require("bcrypt");

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
    console.log(err);
    res
      .status(500)
      .send({ success: false, error: "Internal Server Occurred." });
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  let success = false;
  try {
    const { fname, lname, email, password, phone } = req.body;

    const updUser = {};

    if (fname) updUser.fname = fname;
    if (lname) updUser.lname = lname;
    if (email) updUser.email = email;
    if (phone) updUser.phone = phone;

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ success, error: "404 Not Found." });
    }

    user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({
        success,
        error: "User already Exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    if (password) updUser.password = securePassword;

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updUser },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      user,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
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

    res.status(200).send({
      success,
      message: "User Successfully Deleted.",
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};
