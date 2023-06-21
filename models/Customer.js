const mongoose = require('mongoose');
const ExtendSchema = require('mongoose-extend-schema');

const UserSchema = require('./User');

// Create customer schema
const CustomerSchema = ExtendSchema(UserSchema, {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  bannedAt: {
    type: Date,
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  favoritePlaces: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'vendors',
    default: [],
  },
}, { timestamps: true });

// Mapping Schema to Model
const customerModel = mongoose.model('customers', CustomerSchema);

module.exports = customerModel;
