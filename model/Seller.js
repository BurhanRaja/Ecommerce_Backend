const { Schema, default: mongoose } = require("mongoose");

const SellerSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  country_citizenship: {
    type: String,
    required: true
  },
  country_of_birth: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  identity_proof: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Seller");
