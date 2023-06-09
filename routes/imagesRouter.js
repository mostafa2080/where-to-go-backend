const express = require("express");
const imageController = require('../controllers/imageController');

const router = express.Router();

router
    .route("/api/v1/images/customers/:filename")
    .get(imageController.getCustomerImage);
    
router
    .route("/api/v1/images/vendors/:filename")
    .get(imageController.getVendorImage);
    
router
    .route("/api/v1/images/employees/:filename")
    .get(imageController.getEmployeeImage);

router
    .route("/favicon.ico")
    .get(imageController.getFavicon);

module.exports = router;
