const { Schema, default: mongoose } = require("mongoose");

const UserAddressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    addresses: {
      type: [
        {
          address_line_1: {
            type: String,
            required: true,
          },
          address_line_2: {
            type: String,
          },
          city: {
            type: String,
            required: true,
          },
          state: {
            type: String,
            required: true,
          },
          postal_code: {
            type: Number,
            required: true,
          },
          country: {
            type: String,
            required: true,
          },
          address_type: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User_Address", UserAddressSchema);
