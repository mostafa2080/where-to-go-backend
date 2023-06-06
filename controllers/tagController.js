require('../models/Tag');
const mongoose = require('mongoose');

const Tag = mongoose.model('tag');

exports.getTags = async (req, res) => {
    const tags = await Tag.find({});
    return res.status(200).json({ status: 'success', data: tags });
};

exports.getTagById = async (req, res) => {
    const tag = await Tag.findOne({ _id: req.params.id });
    return res.status(200).json({ status: 'success', data: tag });
};

exports.updateTag = async (req, res) => {
    const tag = await Tag.updateOne({ _id: req.params.id }).set({});

    return res.status(200).json({ status: 'success', data: tag });
};

exports.deleteTag = async (req, res) => {
    const tag = await Tag.findOne({ _id: req.params.id });
    tag.delete();

    return res.status(200).json({ status: 'success', data: tag });
};
