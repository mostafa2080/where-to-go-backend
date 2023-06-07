const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Validate category data before sending it to the DB

// Validation for createCategory
exports.validateCreateCategory = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must not exceed 50 characters'),

    validatorMiddleware,
];

// Validation for deleteCategory
exports.validateDeleteCategory = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid category ID'),

    validatorMiddleware,
];

// Validation for updateCategory
exports.validateUpdateCategory = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid category ID'),

    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name must not exceed 50 characters'),

    validatorMiddleware,
];

// Validation for getCategoryById
exports.validateGetCategoryById = [
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Invalid category ID'),

    validatorMiddleware,
];
