const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Validate tag data before sending it to the DB

// Validation for createTag
exports.validateCreateTag = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  body("categoryId")
    .notEmpty()
    .withMessage("Category Id Can't Be Empty")
    .isMongoId()
    .withMessage("Category Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for deleteTag
exports.validateDeleteTag = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for updateTag
exports.validateUpdateTag = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Category Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for getTagById
exports.validateGetTagById = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];
