const express = require("express");
const uadd = require("../../controller/client/address");
const checkUser = require("../../middleware/checkUser");

const router = express.Router();

router.get("/", checkUser, uadd.getUserAdresses);

router.post("/create", checkUser, uadd.createUserAddress);

router.post("/add/:id", checkUser, uadd.addAddress);

router.put("/update/:id", checkUser, uadd.updateUserAddress);

module.exports = router;
