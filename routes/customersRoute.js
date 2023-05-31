const express = require("express");
const controller = require("../controllers/customersController");
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

router.patch(
  "/api/v1/customers/deactivate/:id",
  validateCustomer.validateIdParam,
  controller.deactivateCustomer,
);

router.patch(
  "/api/v1/customers/activate/:id",
  validateCustomer.validateIdParam,
  controller.activateCustomer,
);

router.patch(
  "/api/v1/customers/ban/:id",
  validateCustomer.validateIdParam,
  controller.banCustomer,
);

router.patch(
  "/api/v1/customers/unban/:id",
  validateCustomer.validateIdParam,
  controller.unbanCustomer,
);

module.exports = router;
