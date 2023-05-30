const { body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getEmployeeValidator = [
  body('id').notEmpty().isMongoId().withMessage('not valida mongo id'),
  validatorMiddleware,
];
