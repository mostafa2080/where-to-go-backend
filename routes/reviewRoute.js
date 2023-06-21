const express = require('express');

const router = express.Router();

const {
  createReview,
  getPlaceReviews,
  updateReview,
  deleteReview,
  getReviewById,
} = require('../controllers/reviewController');
const {
  validateCreateReview,
  validateDeleteReview,
  validateUpdateReview,
  validateGetReviewById,
} = require('../utils/validators/reviewValidator');

router.route('/').post(validateCreateReview, createReview);

router
  .route('/:id')
  .get(getPlaceReviews)
  .put(validateUpdateReview, updateReview)
  .delete(validateDeleteReview, deleteReview);

module.exports = router;
