const express = require('express');
const controller = require('../controllers/customerController');
const validateCustomer = require('../utils/validators/customerValidator');
const { uploadImg } = require('../utils/imageUtility');

const { EmployeeOrAbove, CustomerOrAbove } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router.get(
  '/getMe',
  controller.getLoggedCustomerData,
  controller.getCustomerById
);
router.put(
  '/changeMyPassaowrd',
  validateCustomer.changeUserPasswordValidator,
  controller.updateLoggedCustomerPassword
);
router.put('/updateMe',uploadImg().single('image'), controller.updateLoggedCustomerData);
router.delete('/deleteMe', controller.deleteLoggedCustomerData);

router
  .route('/')
  .all(EmployeeOrAbove)
  .get(controller.getAllCustomers)
  .post(
    uploadImg().single('image'),
    validateCustomer.validatePostArray,
    controller.addCustomer
  );

router
  .route('/:id')
  .all(CustomerOrAbove, validateCustomer.validateIdParam)
  .get(controller.getCustomerById)
  .patch(
    uploadImg().single('image'),
    validateCustomer.validatePatchArray,
    controller.editCustomer
  )
  .delete(controller.deleteCustomer);

router
  .route('/softDelete/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.softDeleteCustomer
  );

router
  .route('/restore/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.restoreCustomer
  );

router
  .route('/deactivate/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.deactivateCustomer
  );

router
  .route('/activate/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.activateCustomer
  );

router
  .route('/ban/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.banCustomer
  );

router
  .route('/unban/:id')
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.unbanCustomer
  );

module.exports = router;
