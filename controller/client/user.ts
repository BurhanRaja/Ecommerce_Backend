import validateReq from "../../utils/vaidation.js";
import User from "../../model/User.js";
import { UserAuthRequest } from "../../utils/defineauth.js";
import { Response } from "express";
import { UpdateUser } from "../../utils/defineother.js";

// Get User
export const getUser = async (req: UserAuthRequest, res: Response) => {
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
export const updateUser = async (req: UserAuthRequest, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { fname, lname, email, phone } = req.body;

    const updUser = {} as UpdateUser;

    if (fname) updUser.first_name = fname;
    if (lname) updUser.last_name = lname;
    if (email) updUser.email = email;
    if (phone) updUser.phone_number = Number(phone);

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
export const deleteUser = async (req: UserAuthRequest, res: Response) => {
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
