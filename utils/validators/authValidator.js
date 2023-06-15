const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  validatorMiddleware,
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email Can't Be Empty")
    .isEmail()
    .withMessage("Email Must Be Valid Email"),
  body("password").notEmpty().withMessage("Password Can't Be Empty"),
];
