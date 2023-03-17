const {Schema, default: mongoose} = require("mongoose");

const SellerOrderSchema = new Schema({
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Seller"
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    product_info: {
        color: String,
        size: String,
        info: String,
        quantity: Number,
        urls: [String]
    },
    price: {
        type: Number,
        required: true
    }
})