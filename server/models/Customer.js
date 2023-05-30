const mongoose = require('mongoose');
const ExtendSchema = require('mongoose-extend-schema');

const UserSchema = require('./User');

// Create customer schema
const CustomerSchema = ExtendSchema(UserSchema, {
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    date_of_birth: Date,
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
    favourite_places: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'vendors'
    }
});

// Mapping Schema to Model
mongoose.model('customers', CustomerSchema);
