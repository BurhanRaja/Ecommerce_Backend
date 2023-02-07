const jwt = require("jsonwebtoken");
const User = require("../../model/User");

exports.register = async (req, res, next) => {
  try {
    const user = User.create(req.body);
    res.status(201).json({
      status: "Success",
      message: "Successfully Registered!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Fail",
      message: "Some Error Occurred.",
    });
  }
};


exports
