const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Validate role data before sending it to the DB

// Validation for createRole
exports.validateCreateRole = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),

  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions must be an array with at least one permission ID')
    .custom((permissions) => {
      const isValid = permissions.every((permission) =>
        mongoose.Types.ObjectId.isValid(permission)
      );
      if (!isValid) {
        throw new ApiError('Invalid permission ID', 400);
      }
      return true;
    }),
  validatorMiddleware,
];

// Validation for deleteRole
exports.validateDeleteRole = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid role ID'),

  validatorMiddleware,
];

// Validation for updateRole
exports.validateUpdateRole = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid role ID'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),

  body('permissions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Permissions must be an array with at least one permission ID')
    .custom((permissions) => {
      const isValid = permissions.every((permission) =>
        mongoose.Types.ObjectId.isValid(permission)
      );
      if (!isValid) {
        throw new ApiError('Invalid permission ID', 400);
      }
      return true;
    }),

  validatorMiddleware,
];

// Validation for getRoleById
exports.validateGetRoleById = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid role ID'),

  validatorMiddleware,
];
