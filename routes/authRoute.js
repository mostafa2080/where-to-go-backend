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
  registerCustomer,
} = require('../controllers/customerController');

const {
  vendorForgotPassword,
  vendorVerifyPassResetCode,
  vendorResetPassword,
  addVendor,
  uploadVendorImages,
  updatingDatabaseImageValues,
  getAllVendors,
  getTopRatedPlaces,
  getVendor,
  getAllCities,
  getAllStates,
  getAllCountries,
  getVendorsNames,
} = require('../controllers/vendorsController');

const {
  employeeForgotPassword,
  employeeVerifyPassResetCode,
  employeeResetPassword,
} = require('../controllers/employeeController');

const {
  forgotPasswordValidator,
  loginValidator,
  resetPasswordValidator,
} = require('../utils/validators/authValidator');
const {
  validateRegisterArray,
} = require('../utils/validators/customerValidator');
const { addValidationArray } = require('../utils/validators/vendorValidator');

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
router
  .route('/customer/resetPassword')
  .put(resetPasswordValidator, customerResetPassword);

router
  .route('/vendor/forgotPassword')
  .post(forgotPasswordValidator, vendorForgotPassword);
router.route('/vendor/verifyResetCode').post(vendorVerifyPassResetCode);
router
  .route('/vendor/resetPassword')
  .put(resetPasswordValidator, vendorResetPassword);

router
  .route('/employee/forgotPassword')
  .post(forgotPasswordValidator, employeeForgotPassword);
router.route('/employee/verifyResetCode').post(employeeVerifyPassResetCode);
router
  .route('/employee/resetPassword')
  .put(resetPasswordValidator, employeeResetPassword);

router
  .route('/customer/register')
  .post(validateRegisterArray, validatorMiddleware, registerCustomer);

router
  .route('/vendor/register')
  .post(
    uploadVendorImages,
    updatingDatabaseImageValues,
    addValidationArray,
    validatorMiddleware,
    addVendor
  );

router.route('/vendor/:id').get(getVendor);

router.route('/search').get(getAllVendors);
router.route('/topRated').get(getTopRatedPlaces);
router.route('/countries').get(getAllCountries);
router.route('/cities').get(getAllCities);
router.route('/states').get(getAllStates);
router.route('/vendorsNames').get(getVendorsNames)

module.exports = router;
