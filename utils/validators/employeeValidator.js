const { check, body, param, decodedToken } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ApiError = require('../apiError');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
require('../../models/Employee');

exports.getEmployeeValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
];

const Employees = mongoose.model('employees');

exports.createEmployeeValidator = [
  body('name')
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isAlpha()
    .withMessage('Name Must Be Alphabetic'),

  body('email')
    .optional()
    .custom(async (val, { req }) => {
      const vendor = await Employees.findOne({ email: val });
      if (vendor) {
        throw new ApiError('Email Already Exists', 404);
      }
    })
    .withMessage('Email Must Be Unique And Not Duplicated')
    .isEmail()
    .withMessage('Email Must Be Valid Email '),

  body('password').notEmpty().withMessage("Password Can't Be Empty"),

  body('dateOfBirth').notEmpty().withMessage("Date Of Birth Can't Be Empty"),

  body('phoneNumber')
    .notEmpty()
    .withMessage('Please Enter Contact Phone Number'),

  body('country')
    .notEmpty()
    .withMessage("Country Can't Be Empty")
    .isString()
    .withMessage('Country Must Be Alphabetic'),

  body('city')
    .notEmpty()
    .withMessage("City Can't Be Empty")
    .isString()
    .withMessage('City Must Be Alphabetic'),

  body('street')
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage('Last Name Must Be Alphanumeric'),

  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender Must Be Valid Value -> Male | Female'),

  body('hireDate').notEmpty().withMessage("Hire Date Can't Be Empty"),

  body('salary').isNumeric().withMessage('Salary Must Be Numeric Value'),

  body('role')
    .isIn(['Admin', 'Employee'])
    .withMessage('Role Must Be Valid Value -> Admin | Employee'),
];

exports.updateEmployeeValidator = [
  param('id').isMongoId().withMessage('Id Must Be Valid MongoId'),

  body('name')
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isAlpha()
    .withMessage('Name Must Be Alphabetic'),

  body('email').optional().isEmail().withMessage('Email Must Be Valid Email '),

  body('dateOfBirth').notEmpty().withMessage("Date Of Birth Can't Be Empty"),

  body('phoneNumber')
    .notEmpty()
    .withMessage('Please Enter Contact Phone Number'),

  body('country')
    .notEmpty()
    .withMessage("Country Can't Be Empty")
    .isString()
    .withMessage('Country Must Be Alphabetic'),

  body('city')
    .notEmpty()
    .withMessage("City Can't Be Empty")
    .isString()
    .withMessage('City Must Be Alphabetic'),

  body('street')
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage('Last Name Must Be Alphanumeric'),

  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender Must Be Valid Value -> Male | Female'),

  body('hireDate').notEmpty().withMessage("Hire Date Can't Be Empty"),

  body('salary').isNumeric().withMessage('Salary Must Be Numeric Value'),

  body('role')
    .isIn(['Admin', 'Employee'])
    .withMessage('Role Must Be Valid Value -> Admin | Employee'),
];

exports.deleteEmployeeValidator = [
  param('id').isMongoId().withMessage('Id Must Be Valid MongoId'),
];

exports.resetPasswordValidator = [
  param('id').isMongoId().withMessage('Id Must Be Valid MongoId'),
  body('password').notEmpty().withMessage("Password Can't Be Empty"),
];

exports.bannEmployeeValidator = [
  param('id').isMongoId().withMessage('Id Must Be Valid MongoId'),
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
      const user = await Employees.findById(req.decodedToken.id);
      if (!user) {
        throw new ApiError('No User Found For This ID', 404);
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new ApiError('Incorrect User Password', 404);
      }
      //verify password confirmation
      if (val !== req.body.passwordConfirm) {
        throw new ApiError('password does not match', 404);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  param('id').isMongoId().withMessage('Id Must Be Valid MongoId'),

  body('name')
    .notEmpty()
    .withMessage("Name Can't Be Empty")
    .isAlpha()
    .withMessage('Name Must Be Alphabetic'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email Must Be Valid Email '),

  body('password').notEmpty().withMessage("Password Can't Be Empty"),

  body('dateOfBirth').notEmpty().withMessage("Date Of Birth Can't Be Empty"),

  body('phoneNumber')
    .notEmpty()
    .withMessage('Please Enter Contact Phone Number')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Inavalid Phone Number Only EGY And SA Numbers Accepted '),

  body('country')
    .notEmpty()
    .withMessage("Country Can't Be Empty")
    .isString()
    .withMessage('Country Must Be Alphabetic'),

  body('city')
    .notEmpty()
    .withMessage("City Can't Be Empty")
    .isString()
    .withMessage('City Must Be Alphabetic'),

  body('street')
    .notEmpty()
    .withMessage("Last Name Can't Be Empty")
    .isString()
    .withMessage('Last Name Must Be Alphanumeric'),

  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender Must Be Valid Value -> Male | Female'),

  body('hireDate').notEmpty().withMessage("Hire Date Can't Be Empty"),

  body('salary').isNumeric().withMessage('Salary Must Be Numeric Value'),

  body('role')
    .isIn(['Admin', 'Employee'])
    .withMessage('Role Must Be Valid Value -> Admin | Employee'),
  validatorMiddleware,
];
