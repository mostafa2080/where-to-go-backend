const { check } = require('express-validator');
const mongoose = require('mongoose');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Validate permission data before sending it to the DB

// Validation for createPermission
exports.validateCreatePermission = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),
  validatorMiddleware,
];

// Validation for deletePermission
exports.validateDeletePermission = [
  check('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid permission ID'),

  validatorMiddleware,
];

// Validation for updatePermission
exports.validateUpdatePermission = [
  check('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid permission ID'),

  check('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),
  validatorMiddleware,
];

// Validation for getPermissionById
exports.validateGetPermissionById = [
  check('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid permission ID'),
  validatorMiddleware,
];
