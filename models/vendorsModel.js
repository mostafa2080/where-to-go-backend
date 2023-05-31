const mongoose = require("mongoose");
const ExtendSchema = require("mongoose-extend-schema");
const User = require("./User");

const VendorsSchema = ExtendSchema(User, {
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
  isApproved: {
    type: Boolean,
    required: [true, "Please Provide Approval State"],
    default: false,
  },
});

mongoose.model("vendors", VendorsSchema);
