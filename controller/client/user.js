const User = require("../../model/User");


// Get User
exports.getUser = async (req, res, next) => {
  let success = false;

  try {
    const userId = req.body.id;
    const user = User.findById(userId).select("-password");

    success = true;

    return res.send({
      success,
      user,
    });
  } catch (err) {
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
    if (password) updUser.password = password;
    if (phone) updUser.phone = phone;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({success, error: "404 Not Found."});
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
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
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({success, error: "404 Not Found."});
    }

    user = await User.findOneAndDelete(req.params.id, { $set: null });

    success = true;

    res.status(200).send({
      success,
      message: "User Successfully Deleted.",
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};