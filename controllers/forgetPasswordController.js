const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendEmail");
const { use } = require("../routes/imagesRouter");

require("../models/Customer");
require("../models/Vendor");
require("../models/Employee");

const forgetMessage = (user) => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #333333;
        }
        .container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #cccccc;
        }
        h1 {
          font-size: 20px;
          margin-bottom: 20px;
        }
        p {
          margin-bottom: 10px;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          color: #3366cc;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hi ${user.firstName},</h1>
        <p>We have received a request to reset your password on Where To Go Account.</p>
        <p class="code">${resetCode}</p>
        <p>Enter this code to complete the reset request.</p>
        <p>Thanks for helping us keep your account secure.</p>
        <p class="footer">The Where To Go Team</p>
      </div>
    </body>
  </html>
  `;
};
const approvalMessage = (user, resetCode) => {
  return `
  <html>
    <head>
      <style>/* Styles for the email content */</style>
    </head>
    <body>
      <div class="container">
        <h4>Congratlations Mr ${user.firstName + " " + user.lastName} </h4>
        <p class="code">${resetCode}</p>
        <p>Your Request For Being Vendor Has Been Approved</p>
        <p>Here is The Secret Key To Assign Your Password</p>
      </div>
    </body>
  </html>`;
};

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.forgotPassword = (model) =>
  asyncHandler(async (req, res, next) => {
    console.log("insde forget");
    //1) get user by email
    const user = await model.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new ApiError(`User not found for this email ${req.body.email}`, 404)
      );
    }

    //2) if email is exist, generate a hash reset random 6 digits and save it in DB
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    //save the hashed reset code into the database
    user.passwordResetToken = hashedResetCode;
    //add expiration time to the password reset code (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    const message =
      req.body.modelType !== null
        ? approvalMessage(user, resetCode)
        : forgetMessage(user);

    //3) send the reset code via email
    try {
      await sendMail({
        email: user.email,
        subject: "Your Password reset code (Valid for 10 min )",
        message,
      });
    } catch (e) {
      user.resetCode = undefined;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return next(
        new ApiError(
          "Something went wrong when sending email, please try again later",
          500
        )
      );
    }

    res.status(200).json({
      status: "success",
      message: "Your reset code sent successfully",
    });
  });

//@desc verify reset code
//@route POST /api/v1/auth/model/verifyResetCode
//@access public
let userMail = "";

exports.verifyPassResetCode = (model) =>
  asyncHandler(async (req, res, next) => {
    // 1) get user based on reset code
    const hashedCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");

    const user = await model.findOne({
      passwordResetToken: hashedCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ApiError("Password reset token is invalid or has expired", 400)
      );
    }

    // Update the user's passwordResetVerified field
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({ status: "success" });
    userMail = user.email;
  });
//@desc  reset pw
//@route POST /api/v1/auth/model/resetPassword
//@access public
exports.resetPassword = (model) =>
  asyncHandler(async (req, res, next) => {
    //1) get user based on their email
    const user = await model.findOne({ email: userMail });

    if (!user) {
      return next(
        new ApiError(`User not found for this email ${req.body.email}`, 404)
      );
    }

    //2) check if reset code is verified
    if (!user.passwordResetVerified) {
      return next(new ApiError("Password reset token not verified", 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    //3) if everything okay, generate a new token
    const token = createToken(user._id);
    res.status(200).json({ token });
  });
