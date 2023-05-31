const { body, param } = require("express-validator");

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.validatePostArray = [
  body("firstName").notEmpty().isAlpha().withMessage("First name must be alphabetic"),
  body("lastName").notEmpty().isAlpha().withMessage("Last name must be alphabetic"),
  body("email").notEmpty().isEmail().withMessage("Email is not valid"),
  body("password").notEmpty().isStrongPassword().withMessage("Password must be strong"),
  body("street").optional().notEmpty().isString().withMessage("Street must be alphabetic"),
  body("country").optional().notEmpty().isAlpha().withMessage("Country must be alphabetic"),
  body("state").optional().notEmpty().isAlpha().withMessage("State must be alphabetic"),
  body("city").optional().notEmpty().isAlpha().withMessage("City must be alphabetic"),
  body("zip").optional().notEmpty().isNumeric().withMessage("Zip must be numeric"),
  body("phoneNumber").optional().notEmpty().isMobilePhone().withMessage("Phone number is not valid"),
  body("dateOfBirth")
    .notEmpty()
    .optional()
    .isDate()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .notEmpty()
    .optional()
    .isIn(["male", "female"])
    .withMessage("Gender must be either male or female"),
  body("image").optional().isString().withMessage("Image path must be string"),
  validatorMiddleware,
];

exports.validateIdParam = [
  param("id").isMongoId().withMessage("Invalid id"),
  validatorMiddleware
]
