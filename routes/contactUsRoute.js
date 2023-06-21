const express = require('express');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendMail = require('../utils/sendEmail');

const router = express.Router();
const {
  contactUsValidator,
} = require('../utils/validators/contactUsValidator');

router.route('/').post(
  contactUsValidator,
  asyncHandler(async (req, res, next) => {
    console.log(req.body);

    const { name, email, subject, message } = req.body;

    const emailContent = `
      <html>
        <head>
          <style>
            /* Styles for the email content */
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New Contact Form Submission</h1>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Subject: Sending Regards</p>
            <p>Message: ${message}</p>
          </div>
        </body>
      </html>
    `;
    const adminEmail = 'mostafashaaban2080@gmail.com';
    console.log(req.body);
    try {
      await sendMail({
        email: adminEmail,
        subject: 'New Contact Form Submission',
        message: emailContent,
      });
    } catch (error) {
      return next(new ApiError('Failed to send email to admin.', 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact form submitted successfully.',
    });
  })
);

module.exports = router;
