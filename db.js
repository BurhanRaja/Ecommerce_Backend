const mongoose = require("mongoose");

let mongoURI = "mongodb://localhost:27017";

const connectToMongoDB = () => {
  mongoose.connect(
    mongoURI,
    () => {
      console.log("Connected to Mongo.");
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
