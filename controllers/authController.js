const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const customerModel = require('../models/Customer');
const ApiError = require('../utils/apiError');
const sendMail = require('../utils/sendEmail');

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//@desc Forget Password
//@route POST /api/v1/auth/forgetPassword
//@access public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1) get user by email
  const user = await customerModel.findOne({ email: req.body.email });
  console.log(req.body.email);
//   console.log(user)
  if (!user) {
    return next(
      new ApiError(`User not found for this email ${req.body.email}`, 404)
    );
  }
  //2) if email is exist , generate hash reset random 6 digits and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  console.log(resetCode);
  console.log(hashedResetCode);

  //save the hashed reset code into the database
  user.passwordResetToken = hashedResetCode;
  //add expiration time to the password reset code (10 minutes)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  const message = `Hi ${user.name}\n we have received a request to reset your password on E-Shop Account \n ${resetCode} \n Enter this code to complete the reset request. \n Thanks for helping us keep your account secure \n The E-Shop Team`;

  //3) send the reset code via email
  try {
    await sendMail({
      email: user.email,
      subject: 'Your Password resset code (Valid for 10 min )',
      message,
    });
  } catch (e) {
    user.resetCode = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new ApiError(
        'Something went wrong when sending email, please try again later',
        500
      )
    );
  }
  res
    .status(200)
    .json({ status: 'success', message: 'Your reset code sent successfully' });
});
