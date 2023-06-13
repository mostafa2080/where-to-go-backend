const { check, body, param } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
require('../../models/Customer');

const Customer = mongoose.model('customers');

exports.validatePostArray = [
  body('firstName')
    .notEmpty()
    .isAlpha()
    .withMessage('First name must be alphabetic'),
  body('lastName')
    .notEmpty()
    .isAlpha()
    .withMessage('Last name must be alphabetic'),
  body('email').notEmpty().isEmail().withMessage('Email is not valid'),
  body('password')
    .notEmpty()
    .isStrongPassword()
    .withMessage('Password must be strong'),
  body('street').isString().optional().withMessage('Street must be alphabetic'),
  body('country')
    .isString()
    .optional()
    .withMessage('Country must be alphabetic'),
  body('state').isString().optional().withMessage('State must be alphabetic'),
  body('city').isString().optional().withMessage('City must be alphabetic'),
  body('zip')
    .matches(/^(\d{5}(?:[-\s]\d{4})?)?$/)
    .optional()
    .withMessage('Zip must be numeric'),
  body('phoneNumber')
    .isString()
    .optional()
    .withMessage('Phone number is not valid'),
  body('dateOfBirth')
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
    .withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Gender must be either male or female'),
  validatorMiddleware,
];

exports.validatePatchArray = [
  body('firstName')
    .optional()
    .isAlpha()
    .withMessage('First name must be alphabetic'),
  body('lastName')
    .optional()
    .isAlpha()
    .withMessage('Last name must be alphabetic'),
  body('email').optional().isEmail().withMessage('Email is not valid'),
  body('password')
    .optional()
    .matches(
      /^(?:(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,})?$/
    )
    .withMessage('Password must be strong'),
  body('street').optional().isString().withMessage('Street must be alphabetic'),
  body('country')
    .optional()
    .isString()
    .withMessage('Country must be alphabetic'),
  body('state').optional().isString().withMessage('State must be alphabetic'),
  body('city').optional().isString().withMessage('City must be alphabetic'),
  body('zip')
    .optional()
    .matches(/^(?:\d{5}(?:-\d{4})?|)$/)
    .withMessage('Zip is not valid'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Phone number is not valid'),
  body('dateOfBirth')
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
    .withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Gender must be either male or female'),
  validatorMiddleware,
];

exports.validateIdParam = [
  param('id').isMongoId().withMessage('Invalid id'),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Enter Your Current Password'),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('Enter Your New Password Confirmation'),
  body('password')
    .notEmpty()
    .withMessage('Enter Your New Password')
    .custom(async (val, { req }) => {
      //verify current password
      const user = await Customer.findById(req.decodedToken.id);
      if (!user) {
        throw new Error('No User Found For This ID');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error('Incorrect User Password');
      }
      //verify password confirmation
      if (val !== req.body.passwordConfirm) {
        throw new Error('password does not match');
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body('firstName')
    .notEmpty()
    .isAlpha()
    .withMessage('First name must be alphabetic'),
  body('lastName')
    .notEmpty()
    .isAlpha()
    .withMessage('Last name must be alphabetic'),
  check('email')
    .notEmpty()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom((val) =>
      Customer.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already exists'));
        }
      })
    ),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Inavalid Phone Number Only EGY And SA Numbers Accepted '),

  validatorMiddleware,
];

exports.validateFavouriteIDs = [
  body('customerId').isMongoId().withMessage('Invalid customer id'),
  body('vendorId').isMongoId().withMessage('Invalid vendor id'),
  validatorMiddleware,
]
