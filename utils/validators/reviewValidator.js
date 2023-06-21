const { body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/Customer');
const ApiError = require('../apiError');
const Place = require('../../models/Vendor');
const Review = require('../../models/Review');

// Validation for createReview
exports.validateCreateReview = [
  body('placeId').custom(async (value) => {
    const place = await Place.findById(value);
    if (!place) {
      throw new ApiError('Invalid place ID', 404);
    }
    return true;
  }),

  body('userId').custom(async (value, { req }) => {
    console.log(req.decodedToken.payload.id);
    const user = await User.findById(req.decodedToken.payload.id);
    if (!user) {
      throw new ApiError('Invalid user ID', 404);
    }
    if (req.decodedToken.payload.id === 'vendor') {
      throw new ApiError(
        'As a Vendor your are not allowed to perform this action ',
        404
      );
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
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating Value must be  between 1 and 5'),

  validatorMiddleware,
];

// Validation for updateReview
exports.validateUpdateReview = [
  param('id')
    .isMongoId()
    .withMessage('Cannot find review with this id')
    .custom((value, { req }) => {
      console.log(req.decodedToken.payload.role);
      return new Promise((resolve, reject) => {
        Review.findById(value)
          .then((review) => {
            if (!review) {
              const error = new ApiError('No Review Found for this ID', 404);
              reject(error);
            } else if (
              review.userId.toString() !==
              req.decodedToken.payload.id.toString()
            ) {
              const error = new ApiError(
                'You do not have the right to perform this action',
                400
              );
              reject(error);
            } else {
              resolve();
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review content must not exceed 500 characters'),

  body('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be a number between 1 and 5'),

  validatorMiddleware,
];

// Validation for deleteReview
exports.validateDeleteReview = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review id format')
    .custom((value, { req }) => {
      if (req.decodedToken.payload.role === 'Customer') {
        return new Promise((resolve, reject) => {
          Review.findById(value)
            .then((review) => {
              if (!review) {
                const error = new ApiError('No Review Found for this ID', 404);
                reject(error);
              } else if (
                review.userId.toString() !==
                req.decodedToken.payload.id.toString()
              ) {
                const error = new ApiError(
                  'You do not have the right to perform this action',
                  400
                );
                reject(error);
              } else {
                resolve();
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
      if (req.decodedToken.payload.role === 'vendor') {
        console.log(req.decodedToken.payload.role);
        const error = new ApiError(
          'As a Vendor, you do not have the right to perform this action',
          400
        );
        return Promise.reject(error);
      }
    }),
  validatorMiddleware,
];
