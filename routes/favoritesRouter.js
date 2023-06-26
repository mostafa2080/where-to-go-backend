const express = require("express");
const validateCustomer = require("../utils/validators/customerValidator");
const favoritePlacesController = require("../controllers/favoritePlacesController");
const { authorize } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

router
  .route("/")
  .patch(
    authorize(['add_placeToFavorites']),
    validateCustomer.validateFavoriteIDs,
    favoritePlacesController.addPlaceToFavorite
  )
  .delete(
    authorize(['delete_placeFromFavorites']),
    validateCustomer.validateFavoriteIDs,
    favoritePlacesController.removePlace
  );

module.exports = router;
