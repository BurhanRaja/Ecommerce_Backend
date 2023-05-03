let { Schema, default: mongoose } = require("mongoose");

const PaymentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    card_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    is_payed: {
      type: Boolean,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", PaymentSchema);
