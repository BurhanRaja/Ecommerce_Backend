const dotenv = require("dotenv")
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_IP: process.env.MONGO_IP || "mongo",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY
}