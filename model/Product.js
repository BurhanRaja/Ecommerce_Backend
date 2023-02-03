const {Schema, Types, default: mongoose} = require("mongoose");

const ProductSchema = new Schema({
    name: String,
    images: [String],
    description: String,
    price: Float32Array,
    color: String,
    size: String,
    company: {
        type: Schema.Types.ObjectId,
        ref: "Seller"
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    quantity: Number,
    reviews: [{body: String, rating: Number, date: Date, author: String}],
    offer: {
        discount: Number, 
        validUntil: Date
    },
}, {
    timestamps: true
})


module.exports = mongoose.model("Product", ProductSchema);