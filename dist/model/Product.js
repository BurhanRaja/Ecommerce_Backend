import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    images_info: {
        type: [
            {
                _id: String,
                images: [String],
                color: String,
                sizes: [String],
                info_types: [String],
                quantity: Number,
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "sellers",
        required: true,
    },
    seller_info: {
        type: Schema.Types.ObjectId,
        ref: "Sellerinfo",
        required: true,
    },
    parent_category_id: {
        type: Schema.Types.ObjectId,
        ref: "ParentCategory",
        required: true,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
    },
    reviews: [
        {
            content: String,
            ratings: Number,
            created_at: Date,
            updated_at: Date,
            user_id: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
    ],
    discount: {
        type: Schema.Types.ObjectId,
        ref: "Discount",
    },
}, {
    timestamps: true,
});
export default mongoose.model("Product", ProductSchema);
