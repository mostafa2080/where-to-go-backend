const express = require("express");
const vendorsController = require("../controllers/vendorsController");
const vendorValidator = require("../utils/validators/vendorValidator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { vendorForgotPassword } = require("../controllers/vendorsController");
const { authorize } = require("../middlewares/authorizationMiddleware");

const router = express.Router();

router.get(
  "/getMe",  // vendor
  vendorsController.getLoggedVendorData,
  vendorsController.getVendor
);
router.put(
  "/changeMyPassaowrd",   // vendor
  authorize(['changeMyPassaowrd_vendor']), 
  vendorValidator.changeUserPasswordValidator,
  vendorsController.updateLoggedVendorPassword
);
router.put("/updateMe", authorize(['updateMe_vendor']), vendorsController.updateLoggedVendorData);
router.delete("/deleteMe", authorize(['deleteMe_vendor']), vendorsController.deleteLoggedVendorData);

router
  .route("/")
  .get(vendorsController.getAllVendors)
  .post(
    authorize(['create_vendor']),
    vendorsController.uploadVendorImages,
    vendorsController.updatingDatabaseImageValues,
    vendorValidator.addValidationArray,
    validatorMiddleware,
    vendorsController.addVendor
  );

router.route("/approved").get(authorize(['get_approvedVendor']),vendorsController.getApprovedVendors); //emp, admin

router.route("/rejected").get(authorize(['get_rejectedVendor']),vendorsController.getRejectedVendors); //emp, admin

router
  .route("/:id/deactivate") //emp, admin
  .patch(
    authorize(['deactivate_vendor']),
    vendorValidator.paramIdValidationArray,
    validatorMiddleware,
    vendorsController.deactivateVendor
  );

router
  .route("/:id/restore") //emp, admin
  .patch(
    authorize(['restore_vendor']),
    vendorValidator.paramIdValidationArray,
    validatorMiddleware,
    vendorsController.restoreVendor
  );

router.route("/:id/activate").patch( //emp, admin
  authorize(['activate_vendor']),
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
    authorize(['edit_vendor']),                                     //emp, admin, vendor
    vendorsController.uploadVendorImages,
    vendorsController.updatingDatabaseImageValues,
    vendorValidator.updateValidationArray,
    validatorMiddleware,
    vendorsController.updateVendor
  );

module.exports = router;
