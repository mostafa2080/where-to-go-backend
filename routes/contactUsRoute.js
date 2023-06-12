const express = require('express');

const router = express.Router();

const { sendEmailToAdmin } = require('../controllers/contactUsController');
const {
  contactUsValidator,
} = require('../utils/validators/contactUsValidator');

router.route('/').post(
  contactUsValidator,
  (req, res, next) => {
    console.log('hello');
    next();
  },
  sendEmailToAdmin
);

module.exports = router;
