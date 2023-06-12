const express = require('express');
const validatorMiddleware = require('../middlewares/validatorMiddleware');

const router = express.Router();
const {
  vendorLogin,
  customerLogin,
  adminLogin,
} = require('../controllers/authController');

const {
  customerForgotPassword,
  customerVerifyPassResetCode,
  customerResetPassword,
} = require('../controllers/customerController');

const {
  vendorForgotPassword,
  vendorVerifyPassResetCode,
  vendorResetPassword,
} = require('../controllers/vendorsController');

const {
  employeeForgotPassword,
  employeeVerifyPassResetCode,
  employeeResetPassword,
} = require('../controllers/employeeController');

const {
  forgotPasswordValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

router
  .route('/employee/login')
  .post(loginValidator, validatorMiddleware, adminLogin);
router
  .route('/vendor/login')
  .post(loginValidator, validatorMiddleware, vendorLogin);
router
  .route('/customer/login')
  .post(loginValidator, validatorMiddleware, customerLogin);

router
  .route('/customer/forgotPassword')
  .post(forgotPasswordValidator, customerForgotPassword);
router.route('/customer/verifyResetCode').post(customerVerifyPassResetCode);
router.route('/customer/resetPassword').put(customerResetPassword);

router
  .route('/vendor/forgotPassword')
  .post(forgotPasswordValidator, vendorForgotPassword);
router.route('/vendor/verifyResetCode').post(vendorVerifyPassResetCode);
router.route('/vendor/resetPassword').put(vendorResetPassword);

router
  .route('/employee/forgotPassword')
  .post(forgotPasswordValidator, employeeForgotPassword);
router.route('/employee/verifyResetCode').post(employeeVerifyPassResetCode);
router.route('/employee/resetPassword').put(employeeResetPassword);
module.exports = router;
