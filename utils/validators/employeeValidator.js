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
    body('address').isObject().withMessage('Please Enter Address'),
    body('address.city').notEmpty().withMessage('Please Enter City'),
    body('address.street').notEmpty().withMessage('Please Enter Street'),
    body('gender').isIn(['Male','Female']).withMessage('Enter a Valid Gender'),
    body('hireDate').notEmpty().withMessage('Please Enter Hire Date'),
    body('salary').isNumeric().withMessage('Please Enter Salary'),
    body('role').isMongoId().withMessage('Please Enter Valid Role Id'),
];

exports.updateEmployeeValidator = [
    param('id').isMongoId().withMessage('Please Enter Valid Id'),
    body('email').optional().isEmail().withMessage('Please Enter Valid Email'),
    body('address').optional().isObject().withMessage('Please Enter Address'),
    body('address.city').optional().notEmpty().withMessage('Please Enter City'),
    body('address.street').optional().notEmpty().withMessage('Please Enter Street'),
    body('salary').optional().isNumeric().withMessage('Please Enter Salary'),
    body('role').optional().isMongoId().withMessage('Please Enter Valid Role Id'),
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


