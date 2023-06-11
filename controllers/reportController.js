const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const CustomerModel = require('../models/Customer');
const ApiError = require('../utils/apiError');
require('../models/Vendor');

const VendorModel = mongoose.model('vendor');

// @desc      Get User Activity Report
// @route     GET /UserActivityReport
// @access    Private

exports.generateUserActivityReport = asyncHandler(async (req, res, next) => {
  const totalCustomers = await CustomerModel.countDocuments();
  const verifiedCustomers = await CustomerModel.countDocuments({
    verifiedAt: { $ne: null },
  });
  const bannedCustomers = await CustomerModel.countDocuments({
    bannedAt: { $ne: null },
  });
  const deletedCustomers = await CustomerModel.countDocuments({
    deletedAt: { $ne: null },
  });

  if (
    totalCustomers === 0 &&
    verifiedCustomers === 0 &&
    bannedCustomers === 0 &&
    deletedCustomers === 0
  ) {
    throw new ApiError('No user activity data found', 404);
  }

  const report = {
    totalCustomers,
    verifiedCustomers,
    bannedCustomers,
    deletedCustomers,
  };

  res.json(report);
});

// @desc      Get Vendor Performance Report
// @route     GET /generateVendorPerformanceReport
// @access    Private

exports.generateVendorPerformanceReport = asyncHandler(
  async (req, res, next) => {
    const totalVendors = await VendorModel.countDocuments();
    console.log('totalVendors', totalVendors);

    const approvedVendors = await VendorModel.countDocuments({
      isApproved: true,
    });
    console.log('approvedVendors', approvedVendors);

    const vendors = await VendorModel.find();
    console.log('vendors', vendors);

    if (totalVendors === 0 || vendors.length === 0) {
      throw new ApiError('No vendor performance data found', 404);
    }

    const totalRatings = vendors.reduce(
      (sum, vendor) => sum + parseInt(vendor.ratings, 10),
      0
    );
    console.log('totalRatings', totalRatings);

    const averageRatings = totalRatings / vendors.length;
    console.log('averageRatings', averageRatings);

    const report = {
      totalVendors,
      approvedVendors,
      averageRatings,
    };

    res.json(report);
  }
);

// @desc      Get Place Popularity Report
// @route     GET /generatePlacePopularityReport
// @access    Private

exports.generatePlacePopularityReport = asyncHandler(async (req, res, next) => {
  const vendors = await VendorModel.find();
  const popularityData = await Promise.all(
    vendors.map(async (vendor) => {
      const favoriteCount = await CustomerModel.countDocuments({
        favouritePlaces: vendor._id,
      });
      return {
        vendorId: vendor._id,
        placeName: vendor.placeName,
        favoriteCount,
      };
    })
  );

  if (popularityData.length === 0) {
    throw new ApiError('No place popularity data found', 404);
  }

  const report = {
    popularityData,
  };

  res.json(report);
});
