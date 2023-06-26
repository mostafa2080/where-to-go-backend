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
const { authorize } = require('../middlewares/authorizationMiddleware');

router.route('/').post(authorize(['create_review']), validateCreateReview, createReview);

router
  .route('/:id')
  .get(getPlaceReviews)
  .put(authorize(['edit_review']), validateUpdateReview, updateReview)
  .delete(authorize(['delete_review']), validateDeleteReview, deleteReview);

module.exports = router;
