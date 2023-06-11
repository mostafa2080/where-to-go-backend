require('../models/Category');
const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Category = mongoose.model('category');

exports.getCategories = AsyncHandler(async (req, res, next) => {
    const categories = await Category.find({ deletedAt: null });
    if (!categories) throw new ApiError('Categories not found!', 404);
    return res.status(200).json({ status: 'success', data: categories });
});

exports.createCategory = AsyncHandler(async (req, res, next) => {
    const category = await Category.create({ name: req.body.name });
    if (!category) throw new ApiError('Category not created.', 400);
    return res.status(200).json({ status: 'success', data: category });
});

exports.getCategoryById = AsyncHandler(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) throw new ApiError('Category not found!', 404);
    return res.status(200).json({ status: 'success', data: category });
});

exports.updateCategory = AsyncHandler(async (req, res, next) => {
    const category = await Category.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            $set: {
                name: req.body.name,
            },
        },
        { new: true } // Return the updated document
    );

    if (!category) {
        throw new ApiError('Category not found!', 404);
    }

    return res.status(200).json({ status: 'success', data: category });
});

exports.deleteCategory = AsyncHandler(async (req, res, next) => {
    const category = await Category.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            $set: {
                deletedAt: new Date(),
            },
        },
        { new: true } // Return the updated document
    );

    if (!category) {
        throw new ApiError('Category not found!', 404);
    }

    return res.status(200).json({ status: 'success', data: category });
});
