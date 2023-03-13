const Order = require("../model/Order")

exports.getOrders = async (req, res, next) => {
    let order = await Order.aggregate()
}