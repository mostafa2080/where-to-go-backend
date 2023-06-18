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
  getVendorReviewsStatistics,
  getLoggedVendor,
  getVendorMonthlyReviewsStatistics,
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
router.get('/vendorReviewReport', getLoggedVendor, getVendorReviewsStatistics);
router.get(
  '/vendorMonthlyReview',
  getLoggedVendor,
  getVendorMonthlyReviewsStatistics
);
module.exports = router;
