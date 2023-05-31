const express = require('express');
const Controller = require('../controllers/employeeController');
const Validator = require('../utils/validators/employeeValidator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { uploadImg, setImage } = require('../utils/imageUtility');

const router = express.Router();


router.route('/api/v1/employees')
    .get(Controller.getAllEmployees)
    .post(uploadImg('Employee').single('image'), setImage, Validator.createEmployeeValidator, validatorMiddleware, Controller.createEmployee);


router.route('/api/v1/employees/:id')
    .get(Validator.getEmployeeValidator, validatorMiddleware, Controller.getEmployeeById)
    .put(uploadImg('Employee').single('image'),setImage,Validator.updateEmployeeValidator , validatorMiddleware, Controller.updateEmployee)
    .delete(Validator.deleteEmployeeValidator, validatorMiddleware, Controller.deleteEmployee);

router.route('/api/v1/employees/resetPassword/:id')
    .put(Validator.resetPasswordValidator, validatorMiddleware, Controller.resetPassword);

router.route('/api/v1/employees/ban/:id')
    .put(Validator.bannEmployeeValidator, validatorMiddleware, Controller.banEmployee);

router.route('/api/v1/employees/unban/:id')
    .put(Validator.bannEmployeeValidator, validatorMiddleware, Controller.unbanEmployee);

router.route('/api/v1/employees/deactivate/:id')
    .put(Validator.bannEmployeeValidator, validatorMiddleware, Controller.deactivateEmployee);

router.route('/api/v1/employees/activate/:id')
    .put(Validator.bannEmployeeValidator, validatorMiddleware, Controller.activateEmployee);


module.exports = router;