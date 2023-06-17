const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

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
    .withMessage('Email must be in Email Format "example@example.com"...!'),
  check("password")
    .notEmpty()
    .withMessage('Password required...!'),
];

exports.resetPasswordValidator = [
  body('passwordConfirm')
      .notEmpty()
      .withMessage('Enter Your New Password Confirmation'),
  body('password')
      .custom((value, {req}) => {
          if (value !== req.body.passwordConfirm) {
              throw new Error('password does not match');
          }
          return true;
      }),
  validatorMiddleware,
]
