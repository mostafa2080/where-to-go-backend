const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    country: String,
    state: String,
    city: String,
    street: String,
    zip: Number,
});

// Create user schema
module.exports = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: String,
        address: AddressSchema,
        deactivated_at: {
            type: Date,
            default: null
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles'
        }
    }
);
