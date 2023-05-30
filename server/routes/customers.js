const express = require("express");
const validateMW = require("../middlewares/validatorMiddleware");
const controller = require("../controllers/customersController");
const validateCustomer = require("../utils/validators/customerValidator");
const multerMW = require("../utils/imageUtility");

const router = express.Router();

router
  .route("/api/v1/customers")
  .get(controller.getAllCustomers)
//   .post(
//     multerMW.uploadImg('customers'),
//     validateCustomer.validatePostArray,
//     validateMW.validateImageMW,
//     controller.addEmployee
//   )
//   .patch(
//     multerMW,
//     validateCustomer.validatePatchArrayAdmin,
//     validateMW.validateImageMW,
//     controller.updateEmployeeByAdmin
//   )
//   .delete(
//     multerMW,
//     validateCustomer.validateId,
//     validateMW,
//     controller.deleteEmployee
//   );

// router
//   .route("/employees/:id")
//   .get(
//     validateCustomer.validateIdParam,
//     validateMW,
//     controller.getEmployeeById
//   )
//   .patch(
//     multerMW,
//     validateCustomer.validatePatchArrayEmployee,
//     validateMW.validateImageMW,
//     controller.updateEmployeeById
//   )

// router
//   .route("/employees/activate/:id")
//   .patch(
//     multerMW,
//     validateCustomer.validatePatchArrayActivate,
//     validateMW.validateImageMW,
//     controller.activateEmployee
//   )

module.exports = router;
