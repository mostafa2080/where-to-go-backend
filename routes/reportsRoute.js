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
  getVendorWeeklyReviewsStatistics,
  getLoggedVendorTotalFavStatistics,
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
  '/vendorTotalReview',
  getLoggedVendor,
  getVendorTotalReviewsStatistics
);
router.get(
  '/vendorMonthlyReview',
  getLoggedVendor,
  getVendorMonthlyReviewsStatistics
);
router.get(
  '/vendorWeeklyReview',
  getLoggedVendor,
  getVendorWeeklyReviewsStatistics
);

router.get(
  '/vendorTotalFav',
  getLoggedVendor,
  getLoggedVendorTotalFavStatistics
);
router.get(
  '/vendorMonthlyFav',
  getLoggedVendor,
  getLoggedVendorMonthlyFavStatistics
);
router.get(
  '/vendorWeeklyFav',
  getLoggedVendor,
  getLoggedVendorWeeklyFavStatistics
);

module.exports = router;
