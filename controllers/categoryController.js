require('../models/Category');
const mongoose = require('mongoose');

const Category = mongoose.model('category');

exports.getCategories = async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json({ status: 'success', data: categories });
};

exports.getCategoryById = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    return res.status(200).json({ status: 'success', data: category });
};

exports.updateCategory = async (req, res) => {
    const category = await Category.updateOne({ _id: req.params.id }).set({});

    return res.status(200).json({ status: 'success', data: category });
};

exports.deleteCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    category.delete();

    return res.status(200).json({ status: 'success', data: category });
};
