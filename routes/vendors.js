const express = require("express");
const vendorsController = require("../controllers/vendorsController");

const router = express.Router();

router
  .route("/vendors")
  .get(vendorsController.getAllVendors)
  .post(vendorsController.addVendor);

router.route("/vendors/approved").get(vendorsController.getApprovedVendors);

router.route("/vendors/rejected").get(vendorsController.getRejectedVendors);

router
  .route("/vendors/:id/deactivate")
  .patch(vendorsController.deactivateVendor);

router.route("/vendors/:id/restore").patch(vendorsController.restoreVendor);

router
  .route("/vendors/:id")
  .get(vendorsController.getVendor)
  .patch(vendorsController.updateVendor);

module.exports = router;
