import mongoose, { Schema } from "mongoose";
const SellerOrderSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    products: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: "Cartitem",
                required: true,
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            address: {
                type: Schema.Types.ObjectId,
                ref: "User_Address",
            },
            isPayed: {
                type: Boolean,
                default: false,
            },
        },
    ],
}, {
    timestamps: true,
});
export default mongoose.model("sellerorder", SellerOrderSchema);
