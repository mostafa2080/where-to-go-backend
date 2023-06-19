const express = require('express');
const { EmployeeOrAbove } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

const {
  generatePlacePopularityReport,
  generateUserActivityReport,
  generateVendorPerformanceReport,
  vendorReports,
  generateYearlyUserReport,
  generateCurrentMonthUserReport,
  generateUserWeeklyReport,
  generateUserWeeklyDaysReport,
  getVendorTotalReviewsStatistics,
  getLoggedVendor,
  getVendorMonthlyReviewsStatistics,
  getLoggedVendorMonthlyFavStatistics,
  getLoggedVendorWeeklyFavStatistics,
} = require('../controllers/reportController');

router.get(
  '/generatePlacePopularityReport',
  EmployeeOrAbove,
  generatePlacePopularityReport
);
router.get(
  '/generateVendorPerformanceReport',
  EmployeeOrAbove,
  generateVendorPerformanceReport
);
router.get(
  '/generateUserActivityReport',
  EmployeeOrAbove,
  generateUserActivityReport
);
router.get('/vendorReport', EmployeeOrAbove, vendorReports);
router.get('/yearlyReport', EmployeeOrAbove, generateYearlyUserReport);
router.get(
  '/currentMonthlyReport',
  EmployeeOrAbove,
  generateCurrentMonthUserReport
);
router.get('/weeklyReport', EmployeeOrAbove, generateUserWeeklyReport);

//vendor dashboard
router.get(
  '/vendorTotalReviewReport',
  getLoggedVendor,
  getVendorTotalReviewsStatistics
);
router.get(
  '/vendorMonthlyReview',
  getLoggedVendor,
  getVendorMonthlyReviewsStatistics
);
router.get(
  '/vendorFavStatistics',
  getLoggedVendor,
  getLoggedVendorMonthlyFavStatistics
);
router.get(
  '/vendorWeeklyFavStatistics',
  getLoggedVendor,
  getLoggedVendorWeeklyFavStatistics
);
module.exports = router;
