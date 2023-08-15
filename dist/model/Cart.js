import mongoose, { Schema } from "mongoose";
const CartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cartItems: [
        {
            type: Schema.Types.ObjectId,
            ref: "Cartitem",
            required: true,
        },
    ],
    total: {
        type: Number,
    },
    is_active: {
        type: Schema.Types.Boolean,
        required: true,
    },
});
export default mongoose.model("Cart", CartSchema);
