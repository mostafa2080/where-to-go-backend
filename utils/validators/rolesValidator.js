const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const ApiError = require("../apiError");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Permission = require("../../models/Permission");

// Validate role data before sending it to the DB

// Validation for createRole
exports.validateCreateRole = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  body("permissions")
    .isArray()
    .withMessage("Permisions Must Be An Array")
    .isLength({ min: 1 })
    .withMessage("Permisions Must Contain At Least 1 Permision")
    .custom(async (permissions) => {
      const permissionIds = permissions.map((permissionId) =>
        mongoose.Types.ObjectId.createFromHexString(permissionId)
      );
      const existingPermissions = await Permission.find({
        _id: { $in: permissionIds },
      });
      if (existingPermissions.length !== permissionIds.length) {
        throw new ApiError("Can't Find This Permision Id", 400);
      }
      return true;
    }),

  validatorMiddleware,
];

// Validation for deleteRole
exports.validateDeleteRole = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];

// Validation for updateRole
exports.validateUpdateRole = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isLength({ max: 50 })
    .withMessage("Name Can't Exceed 50 Characters"),

  body("permissions")
    .isArray()
    .withMessage("Permisions Must Be An Array")
    .isLength({ min: 1 })
    .withMessage("Permisions Must Contain At Least 1 Permision")
    .custom(async (permissions) => {
      const permissionIds = permissions.map((permissionId) =>
        mongoose.Types.ObjectId.createFromHexString(permissionId)
      );
      const existingPermissions = await Permission.find({
        _id: { $in: permissionIds },
      });
      if (existingPermissions.length !== permissionIds.length) {
        throw new ApiError("Can't Find This Permision Id", 400);
      }
      return true;
    }),

  validatorMiddleware,
];

// Validation for getRoleById
exports.validateGetRoleById = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),

  validatorMiddleware,
];
