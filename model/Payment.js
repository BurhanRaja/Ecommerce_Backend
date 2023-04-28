const { default: mongoose, Schema } = require("mongoose");

const PaymentsSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentsSchema);
