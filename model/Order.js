const { Schema, default: mongoose } = require("mongoose");

const OrderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart_id: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  address_id: {
    type: Schema.Types.ObjectId,
    ref: "Useraddress",
    required: true,
  }
});


module.exports = mongoose.model("Order", OrderSchema);