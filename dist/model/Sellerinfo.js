import mongoose, { Schema } from "mongoose";
const SellerInfoSchema = new Schema({
    company_name: {
        type: String,
        required: true,
    },
    company_type: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    company_website: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    identity_proof: {
        type: String,
        required: true,
    },
    tax_info: {
        type: String,
        required: true,
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
}, {
    timestamps: true,
});
export default mongoose.model("Sellerinfo", SellerInfoSchema);
