<<<<<<< HEAD
const mongoose = require("mongoose");
=======
const mongoose = require('mongoose');
>>>>>>> bc8779f7bf2aee8cc4bd92c02368482442e93e02

const AddressSchema = mongoose.Schema({
  country: String,
  state: String,
  city: String,
  street: String,
  zip: Number,
});

// Create user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/,
      'Please Enter Correct Email',
    ],
    unique: [true, 'Email Has To Be Unique'],
    required: [true, 'Please Enter Contact Email'],
  },
  password: String,
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  passwordResetVerified: {
    type: Boolean,
  },
  name: String,
  phone_number: String,
  address: AddressSchema,
  deactivated_at: {
    type: Date,
    default: null,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
  },
});
<<<<<<< HEAD
=======

module.exports = UserSchema;
>>>>>>> bc8779f7bf2aee8cc4bd92c02368482442e93e02
