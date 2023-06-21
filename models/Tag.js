const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Enter tag name'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: [true, 'Enter category id'],
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

mongoose.model('tag', tagSchema);
