const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Enter category name"],
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
