const { check } = require("express-validator");
const mongoose = require("mongoose");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Validate permission data before sending it to the DB

// Validation for createPermission
exports.validateCreatePermission = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 characters"),
  validatorMiddleware,
];

// Validation for deletePermission
exports.validateDeletePermission = [
  check("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for updatePermission
exports.validateUpdatePermission = [
  check("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 characters"),
  validatorMiddleware,
];

// Validation for getPermissionById
exports.validateGetPermissionById = [
  check("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];
