const mongoose = require('mongoose');
const ExtendSchema = require('mongoose-extend-schema');

const UserSchema = require('./User');

// Create customer schema
const CustomerSchema = ExtendSchema(UserSchema, {
    name: String,
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    verified_at: {
        type: Date,
        default: null
    },
    banned_at: {
        type: Date,
        default: null
    },
    image: String,
    favouritePlaces: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'vendors'
    }
});

// Mapping Schema to Model
mongoose.model('customers', CustomerSchema);
