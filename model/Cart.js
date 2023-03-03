let { Schema, default: mongoosese } = require("mongoose");

const CartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ],
    total: {
        type: Schema.Types.Decimal128,
        required: true
    },
    is_active: {
        type: Schema.Types.Boolean,
        required: true
    }
});
