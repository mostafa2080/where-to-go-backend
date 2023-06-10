const express = require("express");
const controller = require("../controllers/customerController");
const validateCustomer = require("../utils/validators/customerValidator");
const { uploadImg } = require("../utils/imageUtility");

const { EmployeeOrAbove } = require("../middlewares/authorizationMiddleware");

const router = express.Router();

router
  .route("/")
  .all(EmployeeOrAbove)
  .get(controller.getAllCustomers)
  .post(
    uploadImg().single("image"),
    validateCustomer.validatePostArray,
    controller.addCustomer
  );

router
  .route("/:id")
  .all(EmployeeOrAbove)
  .get(
    validateCustomer.validateIdParam,
    controller.getCustomerById
  )
  .delete(
    validateCustomer.validateIdParam,
    controller.deleteCustomer
  );

router
  .route("/softDelete/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.softDeleteCustomer
  );

router
  .route("/restore/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.restoreCustomer
  );

router
  .route("/deactivate/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.deactivateCustomer
  );

router
  .route("/activate/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.activateCustomer
  );

router
  .route("/ban/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.banCustomer
  );

router
  .route("/unban/:id")
  .patch(
    EmployeeOrAbove,
    validateCustomer.validateIdParam,
    controller.unbanCustomer
  );

module.exports = router;
