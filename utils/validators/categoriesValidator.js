const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Validate category data before sending it to the DB

// Validation for createCategory
exports.validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  validatorMiddleware,
];

// Validation for deleteCategory
exports.validateDeleteCategory = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for updateCategory
exports.validateUpdateCategory = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  validatorMiddleware,
];

// Validation for getCategoryById
exports.validateGetCategoryById = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];
