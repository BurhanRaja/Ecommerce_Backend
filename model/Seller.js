const { Schema, default: mongoose } = require("mongoose");
const Sellerinfo = require("./Sellerinfo");

const SellerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SellerSchema.pre("findOneAndDelete", async function (seller, next) {
  await Sellerinfo.deleteOne({ seller_id: seller._id });
  next();
});

module.exports = mongoose.model("Seller", SellerSchema);
