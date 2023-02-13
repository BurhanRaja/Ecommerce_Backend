const { Schema, default: mongoose } = require("mongoose");

const CompanySchema = new Schema({
    company_name: {
        type: String,
        required: true
    },
    company_type: {
        type: String,
        required: true
    },
    address_line_1: {
        type: String,
        required: true
    },
    address_line_2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    seller_id: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    postal_code: {
        type: Number,
        required: true
    },
    company_proof: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Company", CompanySchema);