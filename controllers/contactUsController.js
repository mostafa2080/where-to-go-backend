const asyncHandler = require('express-async-handler');
const sendMail = require('../utils/sendEmail');
const ApiError = require('../utils/apiError');

exports.sendEmailToAdmin = () =>
  asyncHandler(async (req, res, next) => {
    console.log('sending email ');
    // Get the necessary information from the contact form submission
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
            <p>Subject: ${subject}</p>
            <p>Message: ${message}</p>
          </div>
        </body>
      </html>
    `;
    const adminEmail = 'mostafashaaban2080@gmail.com';
    try {
      await sendMail({
        email: adminEmail,
        subject: 'New Contact Form Submission',
        message: emailContent,
      });
    } catch (error) {
      return next(new ApiError('Failed to send email to admin.', 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact form submitted successfully.',
    });
  });
