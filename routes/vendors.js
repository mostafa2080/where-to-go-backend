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
    uploadImg().fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "gallery", maxCount: 10 },
    ]),
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
    uploadImg().fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "gallery", maxCount: 10 },
    ]),
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.updateVendor
  );

module.exports = router;
