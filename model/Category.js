const { Schema, default: mongoose } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", CategorySchema);
