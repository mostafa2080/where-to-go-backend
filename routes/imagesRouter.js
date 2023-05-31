const express = require("express");
const imageController = require('../controllers/imagesController');

const router = express.Router();

router
    .route("/api/v1/images/customers/:filename")
    .get(imageController.getCustomerImage);

module.exports = router;
