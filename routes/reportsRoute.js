const express = require('express');
const { EmployeeOrAbove } = require('../middlewares/authorizationMiddleware');

const router = express.Router();

const {
  generatePlacePopularityReport,
  generateUserActivityReport,
  generateVendorPerformanceReport,
  vendorReports,
  generateYearlyUserReport,
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
module.exports = router;
