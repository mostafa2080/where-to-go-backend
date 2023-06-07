const { body, param } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getEmployeeValidator = [
    param('id').isMongoId().withMessage('Please Enter Valid Id'),
];

exports.createEmployeeValidator = [
    body('name').notEmpty().withMessage('Please Enter Employee Name'),
    body('email').isEmail().withMessage('Please Enter Valid Email'),
    body('password').notEmpty().withMessage('Please Enter Password'),
    body('dateOfBirth').notEmpty().withMessage('Please Enter Date Of Birth'),
    body('phoneNumber').notEmpty().withMessage('Please Enter Contact Phone Number'),
    body('country').notEmpty().withMessage('Please Enter country Name'),
    body('city').notEmpty().withMessage('Please Enter City'),
    body('street').notEmpty().withMessage('Please Enter Street'),
    body('gender').isIn(['Male','Female']).withMessage('Enter a Valid Gender'),
    body('hireDate').notEmpty().withMessage('Please Enter Hire Date'),
    body('salary').isNumeric().withMessage('Please Enter Salary'),
    body('role').isIn(['Admin','Employee']).withMessage('Please Enter Valid Role Admin / Employee'),
];

exports.updateEmployeeValidator = [
    param('id').isMongoId().withMessage('Please Enter Valid Id'),
    body('email').optional().isEmail().withMessage('Please Enter Valid Email'),
    body('country').optional().notEmpty().withMessage('Please Enter country Name'),
    body('city').optional().notEmpty().withMessage('Please Enter City'),
    body('street').optional().notEmpty().withMessage('Please Enter Street'),
    body('salary').optional().isNumeric().withMessage('Please Enter Salary'),
    body('role').optional().isIn(['Admin','Employee']).withMessage('Please Enter Valid Role Admin / Employee'),
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


