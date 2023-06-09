require('../models/Tag');
const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Tag = mongoose.model('tag');

exports.getTags = AsyncHandler(async (req, res) => {
    const tags = await Tag.find({ deletedAt: null });
    if (!tags) return new ApiError('Tags not found!', 404);
    return res.status(200).json({ status: 'success', data: tags });
});

exports.createTag = AsyncHandler(async (req, res) => {
    const tag = await Tag.create({ name: req.body.name });
    if (!tag) return new ApiError('Tag not created.', 400);
    return res.status(200).json({ status: 'success', data: tag });
});

exports.getTagById = AsyncHandler(async (req, res) => {
    const tag = await Tag.findOne({ _id: req.params.id });
    if (!tag) return new ApiError('Tag not found!', 404);
    return res.status(200).json({ status: 'success', data: tag });
});

exports.updateTag = AsyncHandler(async (req, res) => {
    const tag = await Tag.findOneAndUpdate({
        _id: req.params.id,
    }).set({
        name: req.body.name,
        categoryId: req.body.categoryId,
    });

    if (!tag) return new ApiError('Tag not found!', 404);
    return res.status(200).json({ status: 'success', data: tag });
});

exports.deleteTag = AsyncHandler(async (req, res) => {
    const tag = await Tag.findOneAndUpdate({
        _id: req.params.id,
    }).set({ deletedAt: new Date() });
    if (!tag) return new ApiError('Tag not found!', 404);

    return res.status(200).json({ status: 'success', data: tag });
});
