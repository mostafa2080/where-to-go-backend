const express = require("express");
const controller = require("../controllers/customersController");
const validateCustomer = require("../utils/validators/customerValidator");
const { uploadImg } = require("../utils/imageUtility");

const router = express.Router();

router
  .route("/api/v1/customers")
  .get(controller.getAllCustomers)
  .post(
    uploadImg("customers").single("image"),
    validateCustomer.validatePostArray,
    controller.addCustomer
  )

router
  .route("/api/v1/customers/:id")
  .get(
    validateCustomer.validateIdParam,
    controller.getCustomerById
  )

module.exports = router;
