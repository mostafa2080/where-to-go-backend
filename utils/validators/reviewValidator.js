const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/Customer');
require('../../models/Vendor');

const Place = mongoose.model('vendor');

// Validate review data before saving it to the DB

// Validation for createReview
exports.validateCreateReview = [
  body('placeId').custom(async (value) => {
    const place = await Place.findById(value);
    if (!place) {
      throw new Error('Invalid place ID');
    }
    return true;
  }),

  body('userId').custom(async (value) => {
    const user = await User.findById(value);
    if (!user) {
      throw new Error('Invalid user ID');
    }
    return true;
  }),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ max: 500 })
    .withMessage('Review content must not exceed 500 characters'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  validatorMiddleware,
];

// Validation for updateReview
exports.validateUpdateReview = [
  param('reviewId')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid review ID'),

  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ max: 500 })
    .withMessage('Review content must not exceed 500 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),

  validatorMiddleware,
];

// Validation for deleteReview
exports.validateDeleteReview = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid review ID'),

  validatorMiddleware,
];

// // Validation for getReviewById
// exports.validateGetReviewById = [
//   param('reviewId')
//     .custom((value) => mongoose.Types.ObjectId.isValid(value))
//     .withMessage('Invalid review ID'),

//   validatorMiddleware,
// ];
