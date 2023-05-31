const express = require('express');

const router = express.Router();
const {
 
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require('../controllers/authController');

const {
  forgotPasswordValidator,
} = require('../utils/validators/authValidator');


router.route('/forgotPassword').post(forgotPasswordValidator, forgotPassword);
// router.route('/verifyResetCode').post(verifyPassResetCode);
// router.route('/resetPassword').put(resetPassword);

module.exports = router;