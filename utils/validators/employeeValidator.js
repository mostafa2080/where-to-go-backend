const { check, body, param, decodedToken } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
require('../../models/Employee');

exports.getEmployeeValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
];

const Employees = mongoose.model('employees');

exports.createEmployeeValidator = [
  body('name').notEmpty().withMessage('Please Enter Employee Name'),
  body('email').isEmail().withMessage('Please Enter Valid Email'),
  body('password').notEmpty().withMessage('Please Enter Password'),
  body('dateOfBirth').notEmpty().withMessage('Please Enter Date Of Birth'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Please Enter Contact Phone Number'),
  body('country').notEmpty().withMessage('Please Enter country Name'),
  body('city').notEmpty().withMessage('Please Enter City'),
  body('street').notEmpty().withMessage('Please Enter Street'),
  body('gender').isIn(['Male', 'Female']).withMessage('Enter a Valid Gender'),
  body('hireDate').notEmpty().withMessage('Please Enter Hire Date'),
  body('salary').isNumeric().withMessage('Please Enter Salary'),
  body('role')
    .isIn(['Admin', 'Employee'])
    .withMessage('Please Enter Valid Role Admin / Employee'),
];

exports.updateEmployeeValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
  body('email').optional().isEmail().withMessage('Please Enter Valid Email'),
  body('country')
    .optional()
    .notEmpty()
    .withMessage('Please Enter country Name'),
  body('city').optional().notEmpty().withMessage('Please Enter City'),
  body('street').optional().notEmpty().withMessage('Please Enter Street'),
  body('salary').optional().isNumeric().withMessage('Please Enter Salary'),
  body('role')
    .optional()
    .isIn(['Admin', 'Employee'])
    .withMessage('Please Enter Valid Role Admin / Employee'),
];

exports.deleteEmployeeValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
];

exports.resetPasswordValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
  body('password').notEmpty().withMessage('Please Enter Password'),
];

exports.bannEmployeeValidator = [
  param('id').isMongoId().withMessage('Please Enter Valid Id'),
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
  body('name').notEmpty().withMessage('Please Enter Employee Name'),
  check('email')
    .notEmpty()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom((val) =>
      Employees.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('Email already exists'));
        }
      })
    ),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Inavalid Phone Number Only EGY And SA Numbers Accepted '),
  body('country')
    .optional()
    .notEmpty()
    .withMessage('Please Enter country Name'),
  body('city').optional().notEmpty().withMessage('Please Enter City'),
  body('street').optional().notEmpty().withMessage('Please Enter Street'),
  body('city').optional().notEmpty().withMessage('Please Enter City'),
  body('zip').optional().notEmpty().withMessage('Please Enter Zip code'),
  validatorMiddleware,
];
