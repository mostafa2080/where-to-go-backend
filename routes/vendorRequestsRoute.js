const express = require("express");
const vendorRequestsController = require("../controllers/vendorRequestsController");

const router = express.Router();

router
  .route("/")
  .get(vendorRequestsController.getAllVendorRequests)
  .post(vendorRequestsController.addVendorRequest);

router
  .route("/:id")
  .get(vendorRequestsController.getVendorRequest)
  .patch(vendorRequestsController.updateVendorRequest);

module.exports = router;
