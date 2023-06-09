const express = require("express");
const vendorsController = require("../controllers/vendorsController");
const vendorValidator = require("../utils/validators/vendorValidator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { uploadImg, setImage } = require("../utils/imageUtility");

const router = express.Router();

router
  .route("/vendors")
  .get(vendorsController.getAllVendors)
  .post(
    uploadImg().single("image"),
    vendorValidator.addValidationArray,
    validatorMiddleware,
    vendorsController.addVendor
  );

router
  .route("/vendors/approved")
  .get(
    vendorValidator.getValidationArray,
    validatorMiddleware,
    vendorsController.getApprovedVendors
  );

router
  .route("/vendors/rejected")
  .get(
    vendorValidator.getValidationArray,
    validatorMiddleware,
    vendorsController.getRejectedVendors
  );

router
  .route("/vendors/:id/deactivate")
  .patch(
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.deactivateVendor
  );

router
  .route("/vendors/:id/restore")
  .patch(
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.restoreVendor
  );

router
  .route("/vendors/:id")
  .get(
    vendorValidator.getValidationArray,
    validatorMiddleware,
    vendorsController.getVendor
  )
  .patch(
    uploadImg().single("image"),
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.updateVendor
  );

module.exports = router;
