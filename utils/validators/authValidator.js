const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.forgotPasswordValidator = [
  check('email')
    .notEmpty()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email Required...!')
    .isEmail()
    .withMessage('Email must be in Email Format "example@example.com"...!'),
  check("password")
    .notEmpty()
    .withMessage('Password required...!'),
];