const express = require("express");
const controller = require("../controllers/customerController");
const validateCustomer = require("../utils/validators/customerValidator");
const { uploadImg } = require("../utils/imageUtility");

const router = express.Router();

router
  .route("/api/v1/customers")
  .get(controller.getAllCustomers)
  .post(
    uploadImg().single("image"),
    validateCustomer.validatePostArray,
    controller.addCustomer
  )

router
  .route("/api/v1/customers/:id")
  .get(
    validateCustomer.validateIdParam,
    controller.getCustomerById
  )

router
  .route("/api/v1/customers/deactivate/:id")
  .patch(
    validateCustomer.validateIdParam,
    controller.deactivateCustomer,
  );

router
  .route("/api/v1/customers/activate/:id")
  .patch(
    validateCustomer.validateIdParam,
    controller.activateCustomer,
  );

router
  .route("/api/v1/customers/ban/:id")
  .patch(
    validateCustomer.validateIdParam,
    controller.banCustomer,
  );

router
  .route("/api/v1/customers/unban/:id")
  .patch(
    validateCustomer.validateIdParam,
    controller.unbanCustomer,
  );

module.exports = router;
