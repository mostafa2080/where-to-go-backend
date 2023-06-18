const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

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
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
      required: [false, "Some times there will be no PlaceId"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

mongoose.model("notification", NotificationSchema);
