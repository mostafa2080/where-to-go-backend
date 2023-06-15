const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/Customer");
const ApiError = require("../apiError");
require("../../models/Vendor");

const Place = mongoose.model("vendor");

// Validation for createReview
exports.validateCreateReview = [
  body("placeId").custom(async (value) => {
    const place = await Place.findById(value);
    if (!place) {
      throw new ApiError("Invalid place ID", 404);
    }
    return true;
  }),

  body("userId").custom(async (value) => {
    const user = await User.findById(value);
    if (!user) {
      throw new ApiError("Invalid place ID", 404);
    }
    return true;
  }),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Review content is required")
    .isLength({ max: 500 })
    .withMessage("Review content must not exceed 500 characters"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  validatorMiddleware,
];

// Validation for updateReview
exports.validateUpdateReview = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid review ID"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Review content is required")
    .isLength({ max: 500 })
    .withMessage("Review content must not exceed 500 characters"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  validatorMiddleware,
];

// Validation for deleteReview
exports.validateDeleteReview = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid review ID"),

  validatorMiddleware,
];
