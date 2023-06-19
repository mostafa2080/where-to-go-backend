const express = require("express");
const vendorsController = require("../controllers/vendorsController");

const router = express.Router();

router.get("/", vendorsController.getTopRatedPlaces);

module.exports = router;
