const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Validate tag data before sending it to the DB

// Validation for createTag
exports.validateCreateTag = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must not exceed 50 characters'),

    body('categoryId').notEmpty().withMessage('Category Id is required'),

    validatorMiddleware,
];

// Validation for deleteTag
exports.validateDeleteTag = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid tag Id'),

    validatorMiddleware,
];

// Validation for updateTag
exports.validateUpdateTag = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid tag Id'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must not exceed 50 characters'),

    body('category').notEmpty().withMessage('Category Id is required'),

    validatorMiddleware,
];

// Validation for getTagById
exports.validateGetTagById = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid tag Id'),

    validatorMiddleware,
];
