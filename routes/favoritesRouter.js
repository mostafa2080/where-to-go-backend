const express = require('express');
const validateCustomer = require('../utils/validators/customerValidator');

const { CustomerOrAbove } = require('../middlewares/authorizationMiddleware');
const favoritePlacesController = require('./../controllers/favoritePlacesController');
const router = express.Router();

router
  .route('/')
  .patch(
    validateCustomer.validateFavoriteIDs,
    favoritePlacesController.addPlaceToFavorite
  )
  .delete(
    validateCustomer.validateFavoriteIDs,
    favoritePlacesController.removePlace
  )

module.exports = router;