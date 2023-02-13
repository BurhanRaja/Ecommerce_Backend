const { Schema, default: mongoose } = require("mongoose");

const SellerInfoSchema = new Schema({
  company_name: {
    type: String,
    required: true,
  },
  company_type: {
    type: String,
    required: true,
  },
  company_website: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
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
    ref: "sellers",
    required: true,
  },
});

module.exports = mongoose.model("Sellerinfo", SellerInfoSchema);