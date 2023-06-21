const express = require('express');
const Controller = require('../controllers/employeeController');
const Validator = require('../utils/validators/employeeValidator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { uploadImg } = require('../utils/imageUtility');
const { Admin } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.get(
  '/getMe',
  Controller.getLoggedEmployeeData,
  Controller.getEmployeeById
);
router.put(
  '/changeMyPassaowrd',
  Validator.changeUserPasswordValidator,
  Controller.updateLoggedEmployeePassword
);
router.put('/updateMe', Controller.updateLoggedEmployeeData);
router.delete(
  '/deleteMe',
  Controller.deleteLoggedEmployeeData
);

router
  .route('')
  .get(Admin, Controller.getAllEmployees)
  .post(
    Admin,
    uploadImg().single('image'),
    Validator.createEmployeeValidator,
    validatorMiddleware,
    Controller.createEmployee
  );
router.route('/filter').get(Admin, Controller.filterEmployee);

router
  .route('/:id')
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
  .route('/resetPassword/:id')
  .put(
    Admin,
    Validator.resetPasswordValidator,
    validatorMiddleware,
    Controller.resetPassword
  );

router
  .route('/ban/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.banEmployee
  );

router
  .route('/unban/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.unbanEmployee
  );

router
  .route('/deactivate/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.deactivateEmployee
  );

router
  .route('/activate/:id')
  .put(
    Admin,
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.activateEmployee
  );

module.exports = router;
