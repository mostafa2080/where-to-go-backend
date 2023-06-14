const express = require('express');
const Controller = require('../controllers/employeeController');
const Validator = require('../utils/validators/employeeValidator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { uploadImg } = require('../utils/imageUtility');
const { Admin } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.get(
  '/api/v1/employees/getMe',
  Controller.getLoggedEmployeeData,
  Controller.getEmployeeById
);
router.put(
  '/api/v1/employees/changeMyPassaowrd',
  Validator.changeUserPasswordValidator,
  Controller.updateLoggedEmployeePassword
);
router.put('/api/v1/employees/updateMe', Controller.updateLoggedEmployeeData);
router.delete(
  '/api/v1/employees/deleteMe',
  Controller.deleteLoggedEmployeeData
);

router
  .route('/api/v1/employees')
  .get(Admin, Controller.getAllEmployees)
  .post(
    Admin,
    uploadImg().single('image'),
    Validator.createEmployeeValidator,
    validatorMiddleware,
    Controller.createEmployee
  );
router.route('/api/v1/employees/filter').get(Admin, Controller.filterEmployee);

router
  .route('/api/v1/employees/:id')
  .get(
    Admin,
    Validator.getEmployeeValidator,
    validatorMiddleware,
    Controller.getEmployeeById
  )
  .put(
    Admin,
    uploadImg().single('image'),
    Validator.updateEmployeeValidator,
    validatorMiddleware,
    Controller.updateEmployee
  )
  .delete(
    Admin,
    Validator.deleteEmployeeValidator,
    validatorMiddleware,
    Controller.deleteEmployee
  );

router
  .route('/api/v1/employees/resetPassword/:id')
  .put(
    Admin,
    Validator.resetPasswordValidator,
    validatorMiddleware,
    Controller.resetPassword
  );

router
  .route('/api/v1/employees/ban/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.banEmployee
  );

router
  .route('/api/v1/employees/unban/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.unbanEmployee
  );

router
  .route('/api/v1/employees/deactivate/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.deactivateEmployee
  );

router
  .route('/api/v1/employees/activate/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.activateEmployee
  );

module.exports = router;
