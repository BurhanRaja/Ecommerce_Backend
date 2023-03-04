const Useraddress = require("../../model/Useraddress");
const { validateReq } = require("../../utils/vaidation");

// Get UserAddress
exports.getUserAdresses = async (req, res, next) => {
  let success = false;
  try {
    let userAddress = await Useraddress.find({ user_id: req.user.id });

    success = true;

    return res.status(200).send({
      success,
      userAddress,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Create First User Address
exports.createUserAddress = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      address_type,
    } = req.body;

    let address = await Useraddress.create({
      user_id: req.user.id,
      addresses: [
        {
          address_line_1,
          address_line_2,
          city,
          state,
          country,
          address_type,
          postal_code,
        },
      ],
    });

    success = true;

    return res.status(200).send({
      success,
      address,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Add more than 1 user address
exports.addAddress = async (req, res, next) => {
  let success = true;

  validateReq(req, res);

  try {
    const {
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      address_type,
    } = req.body;

    let address = await Useraddress.findOne({
      id: req.params.id,
      user_id: req.user.id,
    });

    if (!address) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    address = await Useraddress.findOneAndUpdate(
      { id: req.params.id, user_id: req.user.id },
      {
        $push: {
          addresses: {
            address_line_1,
            address_line_2,
            city,
            state,
            postal_code,
            country,
            address_type,
          },
        },
      }
    );

    success = true;

    return res.status(200).send({
      success,
      address,
    });
  } catch (err) {
    res.status(404).send({ success, message: "404 Not Found" });
  }
};

// Update Address
exports.updateUserAddress = async (req, res, next) => {
  let success = false;

  validateReq(req, res);

  try {
    const {
      address_line_1,
      address_line_2,
      city,
      postal_code,
      country,
      address_type,
    } = req.body;

    let updUserAdd = {
      address_line_1,
      address_line_2,
      city,
      postal_code,
      country,
      address_type,
    };

    let userAddress = await Useraddress.find({
      user_id: req.user.id,
    });

    if (!userAddress) {
      res.status(404).send({ success, message: "404 Not Found" });
    }

    userAddress = await Useraddress.findOneAndUpdate(
      {
        user_id: req.user.id,
        "addresses._id": req.params.id,
      },
      { $set: { "addresses.$": updUserAdd } }
    );

    success = true;

    return res.status(200).send({
      success,
      userAddress,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Address
exports.deleteAddress = async (req, res, next) => {
  let success = true;

  try {
    let address = await Useraddress.find({ user_id: req.user.id });

    if (!address) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    address = await Useraddress.findOneAndUpdate(
      {
        user_id: req.user.id,
      },
      { $pull: { addresses: { _id: req.params.id } } }
    );

    success = true;

    return res.status(200).send({
      success,
      address,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};
