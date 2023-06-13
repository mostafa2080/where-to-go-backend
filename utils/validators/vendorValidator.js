const { check, body, param } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

require('../../models/Vendor');

const Vendor = mongoose.model('vendor');

exports.getValidationArray = [
  param('id').isMongoId().withMessage('Id Needs To Be MongoId'),
];

exports.addValidationArray = [
  body('firstName').isString().withMessage('First Name is Required'),
  body('lastName').isString().withMessage('Last Name is Required'),
  body('email')
    .isEmail()
    .withMessage('Email must be a valid Email & Not duplicated'),
  body('phoneNumber').isString().withMessage('Enter A Valid Phone Number'),
  body('description').isString().withMessage('Description Is Needed'),
  // body("thumbnail").isString().withMessage("Image must be a String"),
  // body("gallery").isString().withMessage("Please Upload Gallery Images"),
  body('category').isMongoId().withMessage('Category is mongoID'),
];

exports.updateValidationArray = [
  body('firstName').optional().isString().withMessage('First Name is Required'),
  body('lastName').optional().isString().withMessage('Last Name is Required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email must be a valid Email & Not duplicated'),
  body('phoneNumber')
    .optional()
    .isString()
    .withMessage('Enter A Valid Phone Number'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description Is Needed'),
  body('thumbnail').optional().isString().withMessage('Image must be a String'),
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Please Upload Gallery Images'),
];

exports.deleteValidationArray = [
  param('id').isMongoId().withMessage('Id Needs To Be MongoId'),
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
      const user = await Vendor.findById(req.decodedToken.id);
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
      Vendor.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already exists'));
        }
      })
    ),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Inavalid Phone Number Only EGY And SA Numbers Accepted '),
  body('thumbnail').optional().isString().withMessage('Image must be a String'),
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Please Upload Gallery Images'),

  validatorMiddleware,
];
