const { body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.contactUsValidator = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  //body('subject').notEmpty().withMessage('Subject is required.'),
  body('message').notEmpty().withMessage('Message is required.'),
  validatorMiddleware,
];
