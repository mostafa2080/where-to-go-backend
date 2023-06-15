const { check, body, param } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

require("../../models/Vendor");

const Vendor = mongoose.model("vendor");

exports.paramIdValidationArray = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),
];

exports.addValidationArray = [
  body("firstName")
    .notEmpty()
    .withMessage("First Name Can't Be Empty")
    .isAlpha()
    .withMessage("First Name Must Be Alphabetical"),

  body("lastName")
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphabetical"),

  body("placeName")
    .notEmpty()
    .withMessage("Place Name Can't Be Empty")
    .isString()
    .withMessage("Place Name Must Be Alphabetical"),

  body("category").isMongoId().withMessage("Category Must Be Valid MongoID"),

  body("street")
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphanumeric"),

  body("country")
    .notEmpty()
    .withMessage("Country Can't Be Empty")
    .isString()
    .withMessage("Country Must Be Alphabetic"),

  body("state")
    .notEmpty()
    .withMessage("State Can't Be Empty")
    .isString()
    .withMessage("State must be Alphabetic"),

  body("city")
    .notEmpty()
    .withMessage("City Can't Be Empty")
    .isString()
    .withMessage("City Must Be Alphabetic"),

  body("zip")
    .optional()
    .matches(/^(\d{5}(?:[-\s]\d{4})?)?$/)
    .toInt()
    .withMessage("Zip must be numeric"),

  body("phoneNumber")
    .notEmpty()
    .isString()
    .withMessage("Phone Number Must Be Valid Phone Number"),

  body("email")
    .custom(async (val, { req }) => {
      const vendor = await Vendor.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("description")
    .notEmpty()
    .isString()
    .withMessage("Description Can't Be Empty"),

  body("thumbnail").notEmpty().isString().withMessage("Image Can't Be Empty"),

  body("gallery")
    .isArray()
    .withMessage("Gallery Must Be An Array")
    .isLength({ min: 3 })
    .withMessage("Gallery Must Contain At Least 3 Images")
    .custom((value) => {
      if (!_.every(value, _.isString)) {
        throw new Error("gallery elements must be strings");
      }
      return true;
    }),
];

exports.updateValidationArray = [
  body("firstName")
    .optional()
    .notEmpty()
    .withMessage("First Name Can't Be Empty")
    .isAlpha()
    .withMessage("First Name Must Be Alphabetical"),

  body("lastName")
    .optional()
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphabetical"),

  body("placeName")
    .optional()
    .notEmpty()
    .withMessage("Place Name Can't Be Empty")
    .isString()
    .withMessage("Place Name Must Be Alphabetical"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category Must Be Valid MongoID"),

  body("street")
    .optional()
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphanumeric"),

  body("country")
    .optional()
    .isString()
    .withMessage("Country Must Be Alphabetic"),

  body("state").optional().isString().withMessage("State must be Alphabetic"),

  body("city").optional().isString().withMessage("City Must Be Alphabetic"),

  body("zip")
    .optional()
    .matches(/^(\d{5}(?:[-\s]\d{4})?)?$/)
    .toInt()
    .withMessage("Zip must be numeric"),

  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone Number Must Be Valid Phone Number"),

  body("email")
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Vendor.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("description")
    .optional()
    .isString()
    .withMessage("Description Can't Be Empty"),

  body("thumbnail").optional().isString().withMessage("Image Can't Be Empty"),

  body("gallery")
    .optional()
    .isArray()
    .withMessage("Gallery Must Be An Array")
    .isLength({ min: 3 })
    .withMessage("Gallery Must Contain At Least 3 Images")
    .custom((value) => {
      if (!_.every(value, _.isString)) {
        throw new Error("gallery elements must be strings");
      }
      return true;
    }),
];

exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password Can't Be Empty"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation Can't Be Empty"),
  body("password")
    .notEmpty()
    .withMessage("New Password Can't Be Empty")
    .custom(async (val, { req }) => {
      //verify current password
      const user = await Vendor.findById(req.decodedToken.id);
      if (!user) {
        throw new Error("No User Found For This ID");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect User Password");
      }
      //verify password confirmation
      if (val !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("firstName")
    .optional()
    .notEmpty()
    .withMessage("First Name Can't Be Empty")
    .isAlpha()
    .withMessage("First Name Must Be Alphabetical"),

  body("lastName")
    .optional()
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphabetical"),

  body("placeName")
    .optional()
    .notEmpty()
    .withMessage("Place Name Can't Be Empty")
    .isAlpha()
    .withMessage("Place Name Must Be Alphabetical"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category Must Be Valid MongoID"),

  body("street")
    .optional()
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphanumeric"),

  body("country")
    .optional()
    .isAlpha()
    .withMessage("Country Must Be Alphabetic"),

  body("state").optional().isAlpha().withMessage("State must be Alphabetic"),

  body("city").optional().isAlpha().withMessage("City Must Be Alphabetic"),

  body("zip")
    .optional()
    .matches(/^(\d{5}(?:[-\s]\d{4})?)?$/)
    .toInt()
    .withMessage("Zip must be numeric"),

  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Phone Number Must Be Valid Phone Number"),

  body("email")
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Vendor.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("description")
    .optional()
    .isString()
    .withMessage("Description Can't Be Empty"),

  body("thumbnail").optional().isString().withMessage("Image Can't Be Empty"),

  body("gallery")
    .optional()
    .isArray()
    .withMessage("Gallery Must Be An Array")
    .isLength({ min: 3 })
    .withMessage("Gallery Must Contain At Least 3 Images")
    .custom((value) => {
      if (!_.every(value, _.isString)) {
        throw new Error("gallery elements must be strings");
      }
      return true;
    }),

  validatorMiddleware,
];
