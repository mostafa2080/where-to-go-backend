const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Vendor = require("../models/Vendor");
const ApiError = require("../utils/apiError");

// @desc      Create a review
// @route     POST /reviews
// @access    Public
// exports.createReview = asyncHandler(async (req, res) => {
//   const userId = req.decodedToken.id;
//   req.body.userId = userId;
//   const review = await Review.create(req.body);

//   res.status(201).json({ success: true, review });
// });
exports.createReview = asyncHandler(async (req, res) => {
  const userId = req.decodedToken.id;
  const { placeId } = req.body;
  // Check if the user has already submitted a review for the place
  const existingReview = await Review.findOne({ userId, placeId });

  await Vendor.updateOne(
    { _id: placeId },
    {
      $inc: { numberOfReviews: 1 },
    }
  );

  if (existingReview) {
    return res.status(400).json({
      success: false,
      error: "You have already submitted a review for this place.",
    });
  }

  // If the user hasn't submitted a review, create a new one
  req.body.userId = userId;
  const review = await Review.create(req.body);
  if (!review) {
    throw new ApiError(
      "Something went wrong while posting your review , try again later..."
    );
  }

  res.status(201).json({ success: true, review });
});

// @desc      get reviews of specific place
// @route     GET /reviews/:placeId
// @access    Public
exports.getPlaceReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ placeId: id })
    .skip(skip)
    .limit(limit)

  if (reviews.length === 0) {
    throw new ApiError("No reviews found", 404);
  }

  const totalReviews = reviews.length;
  let totalRates = 0;

  reviews.forEach((review) => {
    totalRates += review.rating;
  });

  const avgRate = totalRates / totalReviews;

  res.json({ success: true, reviews, totalReviews, avgRate });
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
    throw new ApiError("Review not found", 404);
  }

  res.json({ success: true, review: updatedReview });
});

// @desc      delete review
// @route     DELETE /reviews/:id
// @access    Public
exports.deleteReview = asyncHandler(async (req, res) => {
  const deletedReview = await Review.findByIdAndDelete(req.params.id);

  if (!deletedReview) {
    throw new ApiError("Review not found", 404);
  }

  res.json({ success: "Deleted Successfully", review: deletedReview });
});
