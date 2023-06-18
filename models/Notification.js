const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "Enter tag name"],
    },
    for: {
      type: String,
      required: [true, "Please Who Will Be Notified With This Content"],
    },
  },
  { timestamps: true }
);

mongoose.model("notification", NotificationSchema);
