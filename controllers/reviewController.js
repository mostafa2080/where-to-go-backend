const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const ApiError = require('../utils/apiError');

// @desc      Create a review
// @route     POST /reviews
// @access    Public
exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);

  res.status(201).json({ success: true, review });
});

// @desc      get reviews of specific place
// @route     GET /reviews/:placeId
// @access    Public
exports.getPlaceReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const reviews = await Review.find({ placeId: id });

  if (reviews.length === 0) {
    throw new ApiError('No reviews found', 404);
  }

  res.json({ success: true, reviews });
});

// @desc      update review
// @route     PUT /reviews/:id
// @access    Public
exports.updateReview = asyncHandler(async (req, res) => {
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedReview) {
    throw new ApiError('Review not found', 404);
  }

  res.json({ success: true, review: updatedReview });
});

// @desc      delete review
// @route     DELETE /reviews/:id
// @access    Public
exports.deleteReview = asyncHandler(async (req, res) => {
  const deletedReview = await Review.findByIdAndDelete(req.params.id);

  if (!deletedReview) {
    throw new ApiError('Review not found', 404);
  }

  res.json({ success: 'Deleted Successfully', review: deletedReview });
});
