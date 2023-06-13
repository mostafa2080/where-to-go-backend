const express = require('express');
const validateCustomer = require('../utils/validators/customerValidator');

const { CustomerOrAbove } = require('../middlewares/authorizationMiddleware');
const favourtiePlacesController = require('./../controllers/favouritePlacesController');
const router = express.Router();

router
  .route('/')
  .patch(
    validateCustomer.validateFavouriteIDs,
    favourtiePlacesController.addPlaceToFavourite
  )
  .delete(
    validateCustomer.validateFavouriteIDs,
    favourtiePlacesController.removePlace
  )

module.exports = router;