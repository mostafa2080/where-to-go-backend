const express = require("express");
const vendorsController = require("../controllers/vendorsController");

const router = express.Router();

router
  .route("/")
  .get(vendorsController.getAllVendors)
  .post(vendorsController.addVendor);

router
  .route("/:id")
  .get(vendorsController.getVendor)
  .patch(vendorsController.updateVendor)
  .delete(vendorsController.deactivateVendor)
  .put(vendorsController.restoreVendor);

module.exports = router;
