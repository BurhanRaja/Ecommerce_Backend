const mongoose = require("mongoose");

let mongoURI = "mongodb://localhost:27017";

const connectToMongoDB = () => {
  mongoose.connect(
    mongoURI,
    () => {
      console.log("Connected to Mongo");
    },
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
      replset: {
        socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
      },
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