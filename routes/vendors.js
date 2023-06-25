const express = require("express");
const vendorsController = require("../controllers/vendorsController");
const vendorValidator = require("../utils/validators/vendorValidator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { vendorForgotPassword } = require("../controllers/vendorsController");

const router = express.Router();

router.get(
  "/getMe",
  vendorsController.getLoggedVendorData,
  vendorsController.getVendor
);
router.put(
  "/changeMyPassaowrd",
  vendorValidator.changeUserPasswordValidator,
  vendorsController.updateLoggedVendorPassword
);
router.put("/updateMe", vendorsController.updateLoggedVendorData);
router.delete("/deleteMe", vendorsController.deleteLoggedVendorData);

router.route("/").get(vendorsController.getAllVendors).post(
  // (req) => {
  //   console.log(req.files);
  // },
  vendorsController.uploadVendorImages,
  vendorsController.updatingDatabaseImageValues,
  vendorValidator.addValidationArray,
  validatorMiddleware,
  vendorsController.addVendor
);

router.route("/approved").get(vendorsController.getApprovedVendors);

router.route("/rejected").get(vendorsController.getRejectedVendors);

router
  .route("/:id/deactivate")
  .patch(
    vendorValidator.paramIdValidationArray,
    validatorMiddleware,
    vendorsController.deactivateVendor
  );

router
  .route("/:id/restore")
  .patch(
    vendorValidator.paramIdValidationArray,
    validatorMiddleware,
    vendorsController.restoreVendor
  );

router.route("/:id/activate").patch(
  vendorValidator.paramIdValidationArray,
  validatorMiddleware,
  vendorsController.approveVendor,
  (req, res, next) => {
    console.log("after approval");
    next();
  },
  vendorForgotPassword
);

router.route("/topRated").get(vendorsController.getTopRatedPlaces);

router
  .route("/:id")
  .get(
    vendorValidator.paramIdValidationArray,
    validatorMiddleware,
    vendorsController.getVendor
  )
  .patch(
    vendorsController.uploadVendorImages,
    vendorsController.updatingDatabaseImageValues,
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.updateVendor
  );

module.exports = router;
