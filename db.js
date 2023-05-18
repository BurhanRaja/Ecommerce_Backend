const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  MONGO_DB,
} = require("./config/config");

let mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const connectToMongoDB = () => {
  mongoose.connect(
    mongoURI,
    () => {
      console.log("Connected to Mongo.");
    },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) return console.log("Error: ", err);
      console.log(
        "MongoDB Connection -- Ready state is:",
        mongoose.connection.readyState
      );
    }
  );
};

module.exports = connectToMongoDB;
