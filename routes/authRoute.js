const express = require('express');
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {EmployeeOrAbove, VendorOrAbove, CustomerOrAbove} = require("../middlewares/authorizationMiddleware");

const router = express.Router();
const {
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  vendorLogin,
  customerLogin,
  adminLogin,
} = require('../controllers/authController');

const {
  forgotPasswordValidator,
  loginValidator,
} = require('../utils/validators/authValidator');

router.route('/forgotPassword').post(forgotPasswordValidator, forgotPassword);
router.route('/verifyResetCode').post(verifyPassResetCode);
router.route('/resetPassword').put(resetPassword);

router.route('/employee/login').post(loginValidator, validatorMiddleware, adminLogin)
router.route('/vendor/login').post(loginValidator, validatorMiddleware, vendorLogin)
router.route('/customer/login').post(loginValidator, validatorMiddleware, customerLogin)


module.exports = router;