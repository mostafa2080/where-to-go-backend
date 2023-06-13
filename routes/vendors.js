const express = require("express");
const vendorsController = require("../controllers/vendorsController");
const vendorValidator = require("../utils/validators/vendorValidator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { uploadImg, setImage } = require("../utils/imageUtility");

const router = express.Router();

router
  .route("/")
  .get(vendorsController.getAllVendors)
  .post(
    vendorsController.uploadVendorImages,
    (req, res, next) => {
      console.log("upload", req.body);
      next();
    },
    vendorsController.processingImage,
    (req, res, next) => {
      console.log("processing", req.body);
      next();
    },
    vendorValidator.addValidationArray,
    validatorMiddleware,
    vendorsController.addVendor
  );

router.route("/approved").get(vendorsController.getApprovedVendors);

router.route("/rejected").get(vendorsController.getRejectedVendors);

router
  .route("/:id/deactivate")
  .patch(
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.deactivateVendor
  );

router
  .route("/:id/restore")
  .patch(
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.restoreVendor
  );

router
  .route("/:id")
  .get(
    vendorValidator.getValidationArray,
    validatorMiddleware,
    vendorsController.getVendor
  )
  .patch(
    vendorsController.uploadVendorImages,
    (req, res, next) => {
      console.log("upload", req.body);
      next();
    },
    vendorsController.processingImage,
    (req, res, next) => {
      console.log("processing", req.body);
      next();
    },
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.updateVendor
  );

module.exports = router;
