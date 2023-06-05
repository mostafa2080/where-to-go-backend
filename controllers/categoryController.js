import '../models/Category';
const mongoose = require('mongoose');

const Category = mongoose.model('category');

exports.getAllCategories = async (req, res) => {
    const categories = await Category.find({});
    return res.status(200).json({ status: 'success', data: categories });
};
