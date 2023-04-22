const {Router} = require("express");
const checkSeller = require("../../middleware/checkSeller");
const { getAllSellerOrder } = require("../../controller/sellerorder");
const router = Router();


router.get("/all", checkSeller, getAllSellerOrder);

module.exports = router;