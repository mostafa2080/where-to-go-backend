const express = require("express");
const imageController = require('../controllers/imageController');

const router = express.Router();

router
    .route("/customers/:filename")
    .get(imageController.getCustomerImage);
    
router
    .route("/vendors/:filename")
    .get(imageController.getVendorImage);
    
router
    .route("/employees/:filename")
    .get(imageController.getEmployeeImage);

module.exports = router;
