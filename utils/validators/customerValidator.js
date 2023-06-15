const { check, body, param } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
require("../../models/Customer");

const Customer = mongoose.model("customers");

exports.validatePostArray = [
  body("firstName")
    .notEmpty()
    .withMessage("First Name Can't Be Empty")
    .isAlpha()
    .withMessage("First Must Be Alphabetic"),

  body("lastName")
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isAlpha()
    .withMessage("Last Must Be Alphabetic"),

  body("email")
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Customer.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("password")
    .notEmpty()
    .withMessage("Password Can't Be Empty")
    .isStrongPassword()
    .withMessage(
      "Password Must Be At Least 8 Characters Long Contains 1-9 & A-Z & a-z & special character"
    ),

  body("street")
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage("Last Name Must Be Alphanumeric"),

  body("country")
    .notEmpty()
    .withMessage("Country Can't Be Empty")
    .isAlpha()
    .withMessage("Country Must Be Alphabetic"),

  body("state")
    .notEmpty()
    .withMessage("State Can't Be Empty")
    .isAlpha()
    .withMessage("State must be Alphabetic"),

  body("city")
    .notEmpty()
    .withMessage("City Can't Be Empty")
    .isAlpha()
    .withMessage("City Must Be Alphabetic"),

  body("zip")
    .optional()
    .matches(/^(\d{5}(?:[-\s]\d{4})?)?$/)
    .toInt()
    .withMessage("Zip must be numeric"),

  body("phoneNumber")
    .notEmpty()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Inavalid Phone Number Only EGY And SA Numbers Accepted "),

  body("dateOfBirth")
    .custom((value, { req }) => {
      if (value === "") {
        return true;
      }
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Date of birth must be a valid date");
      }
      return true;
    })
    .optional()
    .withMessage("Date Of Birth Must Be Valid Date"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender Must Be Valid Value -> Male | Female"),

  validatorMiddleware,
];

exports.validatePatchArray = [
  body("firstName")
    .optional()
    .isAlpha()
    .withMessage("First Must Be Alphabetic"),

  body("lastName").optional().isAlpha().withMessage("Last Must Be Alphabetic"),

  body("email")
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Customer.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("password")
    .optional()
    .isStrongPassword()
    .withMessage(
      "Password Must Be At Least 8 Characters Long Contains 1-9 & A-Z & a-z & special character"
    ),

  body("street")
    .optional()
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
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Inavalid Phone Number Only EGY And SA Numbers Accepted "),

  body("dateOfBirth")
    .optional()
    .custom((value, { req }) => {
      if (value === "") {
        return true;
      }
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Date of birth must be a valid date");
      }
      return true;
    })
    .optional()
    .withMessage("Date Of Birth Must Be Valid Date"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender Must Be Valid Value -> Male | Female"),
  validatorMiddleware,
];

exports.validateIdParam = [
  param("id").isMongoId().withMessage("Id Must Be Valid MongoId"),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Enter Your Current Password"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Enter Your New Password Confirmation"),
  body("password")
    .notEmpty()
    .withMessage("Enter Your New Password")
    .custom(async (val, { req }) => {
      //verify current password
      const user = await Customer.findById(req.decodedToken.id);
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
    .isAlpha()
    .withMessage("First Must Be Alphabetic"),

  body("lastName").optional().isAlpha().withMessage("Last Must Be Alphabetic"),

  body("email")
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Customer.findOne({ email: val });
      if (vendor) {
        throw new Error("Email Already Exists");
      }
    })
    .withMessage("Email Must Be Unique And Not Duplicated")
    .isEmail()
    .withMessage("Email Must Be Valid Email "),

  body("password")
    .optional()
    .isStrongPassword()
    .withMessage(
      "Password Must Be At Least 8 Characters Long Contains 1-9 & A-Z & a-z & special character"
    ),

  body("street")
    .optional()
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
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Inavalid Phone Number Only EGY And SA Numbers Accepted "),

  body("dateOfBirth")
    .optional()
    .custom((value, { req }) => {
      if (value === "") {
        return true;
      }
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error("Date of birth must be a valid date");
      }
      return true;
    })
    .optional()
    .withMessage("Date Of Birth Must Be Valid Date"),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender Must Be Valid Value -> Male | Female"),

  validatorMiddleware,
];

exports.validateFavoriteIDs = [
  body("customerId")
    .isMongoId()
    .withMessage("CustomerId Must Be Valid MongoId"),
  body("vendorId").isMongoId().withMessage("VendorId Must Be Valid MongoId"),
  validatorMiddleware,
];
