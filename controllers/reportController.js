/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const apiError = require('../utils/apiError');
const CustomerModel = require('../models/Customer');
const ApiError = require('../utils/apiError');
require('../models/Vendor');
require('../models/Customer');
require('../models/Employee');

const VendorModel = mongoose.model('vendor');
const customerModel = mongoose.model('customers');
const employeeModel = mongoose.model('employees');
const reviewModel = require('../models/Review');

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
// @desc      Get Place Popularity Report
// @route     GET /generatePlacePopularityReport
// @access    Private

exports.vendorReports = async (req, res) => {
  try {
    const totalVendors = await VendorModel.countDocuments();
    const approvedVendors = await VendorModel.countDocuments({
      isApproved: true,
    });
    const notApprovedVendors = await VendorModel.countDocuments({
      isApproved: false,
    });
    const bannedVendors = await VendorModel.countDocuments({
      role: { $ne: null },
    });

    const report = {
      totalVendors,
      approvedVendors,
      notApprovedVendors,
      bannedVendors,
    };

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.generateCurrentMonthUserReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), 0, 1);
    const endOfMonth = new Date(currentDate.getFullYear(), 11, 31);

    const newVendorUsers = await VendorModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const newCustomerUsers = await customerModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const newEmployeeUsers = await employeeModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const report = {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      newVendorUsers,
      newCustomerUsers,
      newEmployeeUsers,
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error generating user report' });
  }
};
exports.generateYearlyUserReport = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();

  const monthlyUserCounts = [];

  // eslint-disable-next-line no-plusplus
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(currentYear, month, 1);
    const endDate = new Date(currentYear, month + 1, 0, 23, 59, 59);

    const customerCount = await CustomerModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const vendorCount = await VendorModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const employeeCount = await employeeModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalUsers = customerCount + vendorCount + employeeCount;

    const monthlyCount = {
      month: month + 1,
      newUsers: totalUsers,
    };

    monthlyUserCounts.push(monthlyCount);
  }

  res.json(monthlyUserCounts);
});

exports.generateUserWholeYearWeeklyReport = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  const daysInMonth = endDate.getDate();

  const weeklyUserCounts = [];

  let startDateOfWeek = startDate;

  while (startDateOfWeek.getMonth() === currentMonth) {
    const endDateOfWeek = new Date(startDateOfWeek);
    endDateOfWeek.setDate(startDateOfWeek.getDate() + 6);

    const customerCount = await CustomerModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const vendorCount = await VendorModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const employeeCount = await employeeModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const totalUsers = customerCount + vendorCount + employeeCount;

    const weeklyCount = {
      week: `${startDateOfWeek.getDate()} - ${endDateOfWeek.getDate()}`,
      newUsers: totalUsers,
    };

    weeklyUserCounts.push(weeklyCount);

    startDateOfWeek.setDate(endDateOfWeek.getDate() + 1);
  }

  res.json(weeklyUserCounts);
});

exports.generateUserWeeklyReport = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

  const daysInMonth = endDate.getDate();

  const weeklyUserCounts = [];

  const startDateOfWeek = startDate;
  let endDateOfWeek = new Date(startDate);
  endDateOfWeek.setDate(startDateOfWeek.getDate() + 6);

  while (startDateOfWeek.getMonth() === currentMonth) {
    const customerCount = await CustomerModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const vendorCount = await VendorModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const employeeCount = await employeeModel.countDocuments({
      createdAt: { $gte: startDateOfWeek, $lte: endDateOfWeek },
    });

    const totalUsers = customerCount + vendorCount + employeeCount;

    const weeklyCount = {
      startDate: startDateOfWeek,
      endDate: endDateOfWeek,
      newUsers: totalUsers,
    };

    weeklyUserCounts.push(weeklyCount);

    startDateOfWeek.setDate(endDateOfWeek.getDate() + 1);
    endDateOfWeek.setDate(startDateOfWeek.getDate() + 6);

    if (endDateOfWeek > endDate) {
      endDateOfWeek = endDate;
    }
  }

  res.json(weeklyUserCounts);
});

//vendor dashboard reports
exports.getLoggedVendor = asyncHandler(async (req, res, next) => {
  req.vendorId = req.decodedToken.payload.id;
  next();
});
exports.getVendorTotalReviewsStatistics = asyncHandler(
  async (req, res, next) => {
    const { vendorId } = req;

    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new ApiError('Vendor not found', 404);
    }

    const numberOfReviews = await reviewModel.countDocuments({
      placeId: vendorId,
    });

    const statistics = {
      numberOfReviews,
    };

    res.status(200).json(statistics);
  }
);
exports.getVendorMonthlyReviewsStatistics = asyncHandler(
  async (req, res, next) => {
    const { vendorId } = req; // Assuming the vendorId is available in the request's authenticated user object

    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new ApiError('Vendor not found', 404);
    }

    const currentYear = new Date().getFullYear();
    const reviews = await reviewModel.find({
      placeId: vendorId,
      timestamp: {
        $gte: new Date(currentYear, 0, 1), // Start of the current year
        $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
      },
    });

    const reviewsByMonth = Array(12).fill(0); // Initialize an array with 12 elements, each initialized with 0

    // Count the number of reviews for each month
    reviews.forEach((review) => {
      const month = review.timestamp.getMonth();
      reviewsByMonth[month]++;
    });

    const statistics = {
      reviewsByMonth,
    };

    res.status(200).json(statistics);
  }
);
exports.getVendorWeeklyReviewsStatistics = asyncHandler(
  async (req, res, next) => {
    const { vendorId } = req; // Assuming the vendorId is available in the request's authenticated user object

    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new ApiError('Vendor not found', 404);
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get the first day of the current month
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const reviews = await reviewModel.find({
      placeId: vendorId,
      timestamp: {
        $gte: startOfMonth, // Start of the current month
        $lt: new Date(currentYear, currentMonth, daysInMonth + 1), // End of the current month
      },
    });

    const weeksInMonth = Math.ceil(daysInMonth / 7); // Calculate the number of weeks in the current month

    const reviewsByWeek = Array(weeksInMonth).fill(0); // Initialize an array with the number of weeks, each initialized with 0

    // Count the number of reviews for each week
    reviews.forEach((review) => {
      const dayOfMonth = review.timestamp.getDate();
      const weekIndex = Math.floor((dayOfMonth - 1) / 7); // Calculate the week index for the review's day
      reviewsByWeek[weekIndex]++;
    });

    const statistics = {
      reviewsByWeek,
    };

    res.status(200).json(statistics);
  }
);

exports.getLoggedVendorTotalFavStatistics = asyncHandler(
  async (req, res, next) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const favoritesTotal = await customerModel.aggregate([
      {
        $match: {
          favoritePlaces: { $in: [req.vendorId] },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    const totalFavorites =
      favoritesTotal.length > 0 ? favoritesTotal[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalFavorites,
      },
    });
  }
);

// exports.getLoggedVendorMonthlyFavStatistics = asyncHandler(
//   async (req, res, next) => {
//     const year = new Date().getFullYear();
//     const startOfYear = new Date(year, 0, 1);
//     const endOfYear = new Date(year, 11, 31);

//     const favoritesByMonth = await customerModel.aggregate([
//       {
//         $match: {
//           favoritePlaces: { $in: [req.vendorId] },
//           createdAt: { $gte: startOfYear, $lte: endOfYear },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: '$createdAt' },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: '$_id',
//           count: 1,
//         },
//       },
//       {
//         $sort: {
//           month: 1,
//         },
//       },
//     ]);

//     console.log('Favorites by month:', favoritesByMonth);

//     res.status(200).json({
//       success: true,
//       data: {
//         favoritesByMonth,
//       },
//     });
//   }
// );
exports.getLoggedVendorMonthlyFavStatistics = asyncHandler(
  async (req, res, next) => {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    const favoritesByMonth = await customerModel.aggregate([
      {
        $match: {
          favoritePlaces: { $in: [req.vendorId] },
          createdAt: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: 1,
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);

    const favoritesByMonthWithZero = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const existingData = favoritesByMonth.find(
        (data) => data.month === month
      );
      return existingData || { month, count: 0 };
    });

    res.status(200).json({
      success: true,
      data: {
        favoritesByMonth: favoritesByMonthWithZero,
      },
    });
  }
);

exports.getLoggedVendorWeeklyFavStatistics = asyncHandler(
  async (req, res, next) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const favoritesByWeek = await customerModel.aggregate([
      {
        $match: {
          favoritePlaces: { $in: [req.vendorId] },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $week: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const favoritesCountArray = favoritesByWeek.map(
      (weekStats) => weekStats.count
    );

    console.log('Favorites count array:', favoritesCountArray);

    res.status(200).json({
      success: true,
      data: {
        favoritesCountArray,
      },
    });
  }
);
