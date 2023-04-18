const { Schema, default: mongoose } = require("mongoose");

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
    ref: "Useraddress",
    required: true,
  },
  payment_status: {
    type: Boolean,
    required: true
  },
  payment_type: {
    type: String
  },
  is_delivered: {
    type: Boolean,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});


module.exports = mongoose.model("Order", OrderSchema);