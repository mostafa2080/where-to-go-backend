const { body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.contactUsValidator = [
  body('name')
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isString()
    .withMessage('Name Must Be Alphabetic'),
  body('email').isEmail().withMessage('Email Must Be Valid Email'),
  // body('subject').notEmpty().withMessage('Subject is required.'),
  body('message').notEmpty().withMessage("Message Can't Be Empty."),
  validatorMiddleware,
];
