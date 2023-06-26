const express = require('express');
const { EmployeeOrAbove, authorize } = require('../middlewares/authorizationMiddleware');

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
  authorize(['get_generatePlacePopularityReport']),
  generatePlacePopularityReport
);
router.get(
  '/generateVendorPerformanceReport',
  authorize(['get_generateVendorPerformanceReport']),
  generateVendorPerformanceReport
);
router.get(
  '/generateUserActivityReport',
  authorize(['get_generateUserActivityReport']),
  generateUserActivityReport
);
router.get('/vendorReport', authorize(['get_vendorReport']), vendorReports);
router.get('/yearlyReport', authorize(['get_yearlyReport']), generateYearlyUserReport);
router.get(
  '/currentMonthlyReport',
  authorize(['get_currentMonthlyReport']),
  generateCurrentMonthUserReport
);
router.get('/weeklyReport', authorize(['get_weeklyReport']), generateUserWeeklyReport);

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
