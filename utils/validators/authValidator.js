const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.forgotPasswordValidator = [
  check('email')
    .notEmpty()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  validatorMiddleware,
];
