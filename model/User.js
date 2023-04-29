const { Schema, default: mongoose } = require("mongoose");
const Useraddress = require("./Useraddress");

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    custormer_id: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.post('findOneAndDelete', async function(user, next) {
  await Useraddress.deleteOne({user_id: user._id});
  next();
});

module.exports = mongoose.model("User", UserSchema);
