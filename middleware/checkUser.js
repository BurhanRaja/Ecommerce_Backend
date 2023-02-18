const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  let success = false;

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      success,
      message: "Please authenticate with valid token",
    });
  }

  let privateKey = process.env.SECRET_KEY;

  const data = jwt.verify(token, privateKey);
  req.user = data.user;

  next();
};

module.exports = checkUser;