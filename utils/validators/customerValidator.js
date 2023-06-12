const { body, param } = require("express-validator");

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.validatePostArray = [
  body("firstName").notEmpty().isAlpha().withMessage("First name must be alphabetic"),
  body("lastName").notEmpty().isAlpha().withMessage("Last name must be alphabetic"),
  body("email").notEmpty().isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().isStrongPassword().withMessage("Password must be strong"),
  body("street").isString().optional().withMessage("Street must be alphabetic"),
  body("country").isString().optional().withMessage("Country must be alphabetic"),
  body("state").isString().optional().withMessage("State must be alphabetic"),
  body("city").isString().optional().withMessage("City must be alphabetic"),
  body("zip").matches(/^(\d{5}(?:[-\s]\d{4})?)?$/).optional().withMessage("Zip must be numeric"),
  body("phoneNumber").isString().optional().withMessage("Phone number is not valid"),
  body("dateOfBirth")
    .custom((value, { req }) => {
      if (value === '') {
        return true;
      }
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Date of birth must be a valid date');
      }
      return true;
    })
    .optional()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
  validatorMiddleware,
];

exports.validatePatchArray = [
  body("firstName").optional().isAlpha().withMessage("First name must be alphabetic"),
  body("lastName").optional().isAlpha().withMessage("Last name must be alphabetic"),
  body("email").optional().isEmail().withMessage("Email is not valid"),
  body("password").optional().isStrongPassword().withMessage("Password must be strong"),
  body("street").optional().isString().withMessage("Street must be alphabetic"),
  body("country").optional().isString().withMessage("Country must be alphabetic"),
  body("state").optional().isString().withMessage("State must be alphabetic"),
  body("city").optional().isString().withMessage("City must be alphabetic"),
  body("zip").optional().matches(/^(\d{5}(?:[-\s]\d{4})?)?$/).withMessage("Zip must be numeric"),
  body("phoneNumber").optional().isString().withMessage("Phone number is not valid"),
  body("dateOfBirth")
    .optional()
    .custom((value, { req }) => {
      if (value === '') {
        return true;
      }
      if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Date of birth must be a valid date');
      }
      return true;
    })
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
  validatorMiddleware,
];

exports.validateIdParam = [
  param("id").isMongoId().withMessage("Invalid id"),
  validatorMiddleware
]
