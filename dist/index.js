import appExp from "./app.js";
import configuration from "./config/config.js";
import mongoose from "mongoose";
let mongoURI = configuration.MONGO_URL
    ? configuration.MONGO_URL
    : `mongodb://${configuration.MONGO_USER}:${configuration.MONGO_PASSWORD}@${configuration.MONGO_IP}:${configuration.MONGO_PORT}/${configuration.MONGO_DB}?authSource=admin`;
const connectToMongoDB = () => {
    mongoose
        .connect(mongoURI)
        .then(() => {
        console.log("Mongo-DB Connected.");
    })
        .catch((err) => {
        console.log(err);
    });
};
const port = configuration.PORT;
connectToMongoDB();
appExp.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
// TODO:
// Handle Payment DB in Order and Create Payment
// Handle it in frontend
