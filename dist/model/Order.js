import mongoose, { Schema } from "mongoose";
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: "User_Address",
        required: true,
    },
    payment_status: {
        type: Boolean,
        required: true,
    },
    payment_type: {
        type: String,
    },
    is_delivered: {
        type: Boolean,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
export default mongoose.model("Order", OrderSchema);
