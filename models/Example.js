const mongoose = require("mongoose");
const { softDeletePlugin } = require("soft-delete-plugin-mongoose");

const VendorsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please Enter Owner First Name"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please Enter Owner Last Name"],
  },
  placeName: {
    type: String,
    trim: true,
    required: [true, "Please Enter Place Name"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please Enter Correct Email",
    ],
    unique: [true, "Email Has To Be Unique"],
    required: [true, "Please Enter Contact Email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Enter Contact Phone Number"],
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
    required: [true, "Please Upload Thumbnail For Your Place"],
  },
  gallery: {
    type: Array,
    default: [],
  },
});

VendorsSchema.plugin(softDeletePlugin);
mongoose.model("vendors", VendorsSchema);
