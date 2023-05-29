const { check } = require('express-validator');
const mongoose = require('mongoose');

const ApiError = require('../apiError');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Validate role data before sending it to the DB
const roleValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),

  check('permissions')
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

module.exports = roleValidator;
