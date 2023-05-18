const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_IP: process.env.MONGO_IP || "localhost",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DB: process.env.MONGO_DB,
  SECRET_KEY: process.env.SECRET_KEY || "test",
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET_KEY,
  RAZORPAY_KEY: process.env.RAZORPAY_KEY_ID,
};
