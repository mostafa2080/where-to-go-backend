const express = require('express');
const Controller = require('../controllers/employeeController');
const Validator = require('../utils/validators/employeeValidator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { uploadImg } = require('../utils/imageUtility');
const { Admin, authorize } = require('../middlewares/authorizationMiddleware');

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
  .get(authorize(['get_employees']), Controller.getAllEmployees)
  .post(
    authorize(['get_employees']),
    uploadImg().single('image'),
    Validator.createEmployeeValidator,
    validatorMiddleware,
    Controller.createEmployee
  );
router.route('/filter').get(authorize(['filter_employee']), Controller.filterEmployee);

router
  .route('/:id')
  .get(
    authorize(['get_employee']),
    Validator.getEmployeeValidator,
    validatorMiddleware,
    Controller.getEmployeeById
  )
  .put(
    authorize(['edit_employee']),
    uploadImg().single('image'),
    Validator.updateEmployeeValidator,
    validatorMiddleware,
    Controller.updateEmployee
  )
  .delete(
    authorize(['delete_employee']),
    Validator.deleteEmployeeValidator,
    validatorMiddleware,
    Controller.deleteEmployee
  );

router
  .route('/resetPassword/:id') //this route can be accessed by Admin , Employee
  .put(
    authorize(['resetPassword_employee']),
    Validator.resetPasswordValidator,
    validatorMiddleware,
    Controller.resetPassword
  );

router
  .route('/ban/:id')
  .put(
    authorize(['ban_employee']),
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.banEmployee
  );

router
  .route('/unban/:id')
  .put(
    authorize(['unban_employee']),
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.unbanEmployee
  );

router
  .route('/deactivate/:id')
  .put(
    authorize(['deactivate_employee']),
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.deactivateEmployee
  );

router
  .route('/activate/:id')
  .put(
    authorize(['activate_employee']),
    Validator.bannEmployeeValidator,
    validatorMiddleware,
    Controller.activateEmployee
  );

module.exports = router;
