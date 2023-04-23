const {Router} = require("express");
const checkSeller = require("../../middleware/checkSeller");
const { getAllSellerOrder, getSingleSellerOrder, getSellerOrderCount } = require("../../controller/sellerorder");
const router = Router();


router.get("/all", checkSeller, getAllSellerOrder);

router.get("/order/count", checkSeller, getSellerOrderCount);

router.get("/:id", checkSeller, getSingleSellerOrder);


module.exports = router;