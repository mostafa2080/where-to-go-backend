import '../models/Category';
const mongoose = require('mongoose');

const Category = mongoose.model('category');

exports.getAllCategories = async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json({ status: 'success', data: categories });
};

exports.getCategory = async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    return res.status(200).json({ status: 'success', data: category });
};
