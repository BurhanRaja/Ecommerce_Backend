const jwt = require("jsonwebtoken");
const Sellerinfo = require("../model/Sellerinfo");

const checkSeller = async (req, res, next) => {
  let success = false;

  if (!req.headers.authorization) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  let privateKey = process.env.SECRET_KEY;

  const data = jwt.verify(token, privateKey);

  let sellerinfo = await Sellerinfo.findOne({ seller_id: data.seller.id });

  console.log(sellerinfo);

  let seller = {
    id: data.seller.id,
    sellerinfo,
  };

  req.seller = seller;

  next();
};

module.exports = checkSeller;
