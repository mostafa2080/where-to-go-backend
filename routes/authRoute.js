const express = require('express');

const router = express.Router();
const { forgotPassword } = require('../controllers/authController');

router.route('/forgotPassword').post(forgotPassword);

module.exports = router;
