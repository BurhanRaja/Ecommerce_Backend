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
      userAddress: userAddress[0]?.addresses,
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

    let address = await Useraddress.findOne({
      user_id: req.user.id,
    });

    if (!address) {
      address = await Useraddress.create({
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
    } else {
      address = await Useraddress.findOneAndUpdate(
        { _id: address._id, user_id: req.user.id },
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
    }

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

// Get Single Address
exports.getSingleAddress = async (req, res, next) => {
  let success = true;

  try {
    let address = await Useraddress.findOne(
      {
        user_id: req.user.id,
        "addresses._id": req.params.id,
      },
      { addresses: { $elemMatch: { _id: req.params.id } } }
    );

    success = true;

    return res.status(200).send({
      success,
      address: address?.addresses[0],
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
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
