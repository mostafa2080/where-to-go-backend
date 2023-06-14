const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const sendMail = require('../utils/sendEmail');

require('../models/Customer');
require('../models/Role');
const forgotPasswordController = require('./forgetPasswordController');
const ApiError = require('../utils/apiError');
const { dirname } = require('path');

const CustomerSchema = mongoose.model('customers');
const VendorSchema = mongoose.model('vendor');
const RoleSchema = mongoose.model('roles');
const saltRounds = 10;

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const greetingMessage = AsyncHandler(async (data) => {
  const emailContent = `
        <html>
          <head>
            <style>
              .container {
                background-color: #f2f2f2;
                padding: 20px;
                border-radius: 5px;
              }
              
              h4 {
                color: #333;
                font-size: 24px;
                margin-bottom: 10px;
              }
              
              p {
                color: #666;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h4>Welcome ${`${data.firstName} ${data.lastName}`} On Board</h4>
              <p>Thank you for registering with us. We are excited to have you as a new member!</p>
            </div>
          </body>
        </html>`;

  const userEmail = data.email;
  try {
    await sendMail({
      email: userEmail,
      subject: 'Greetings From Where To Go',
      message: emailContent,
    });
  } catch (error) {
    throw ApiError(error);
  }
});

exports.getAllCustomers = AsyncHandler(async (req, res, next) => {
  console.log(req.decodedToken);
  const allCustomers = await CustomerSchema.find(
    {},
    {
      id: '$_id',
      firstName: 1,
      lastName: 1,
      phoneNumber: 1,
      email: 1,
      image: 1,
      bannedAt: 1,
      deactivatedAt: 1,
      deletedAt: 1,
      _id: 0,
    }
  );
  if (!allCustomers) return new ApiError('No customers found!', 404);
  res.status(200).json({ data: allCustomers });
});

exports.getCustomerById = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findById(req.params.id)
    .populate('role', 'name')
    .select('-__v');
  if (!customer) return new ApiError('Customer not found!', 404);
  console.log(customer);
  const result = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...customer._doc,
    role: customer.role.name,
  };

  res.status(200).json({ data: result });
});

exports.addCustomer = AsyncHandler(async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  const role = await RoleSchema.findOne({ name: 'Customer' }, { _id: 1 });
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images',
      'customers',
      req.body.image
    );
  } else {
    req.body.image = 'default.jpg';
  }

  const customer = await new CustomerSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    phoneCode: req.body.phoneCode,
    address: {
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      zip: req.body.zip,
    },
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    image: req.body.image,
    role: role._id,
  });
  await customer.save();

  if (req.file) {
    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
      if (err) throw err;
    });
  }
  greetingMessage(customer);
  res.status(201).json({
    data: {
      id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      image: customer.image,
      bannedAt: customer.bannedAt,
      deactivatedAt: customer.deactivatedAt,
      deletedAt: customer.deletedAt,
    },
  });
});

exports.editCustomer = AsyncHandler(async (req, res, next) => {
  const oldCustomer = await CustomerSchema.findById(req.params.id);

  if (!oldCustomer) return new ApiError('Customer not found!', 404);

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images',
      'customers',
      req.body.image
    );
  } else {
    req.body.image = oldCustomer.image;
  }

  const updatedData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    phoneCode: req.body.phoneCode,
    address: {
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      zip: req.body.zip,
    },
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    image: req.body.image,
  };

  if (req.body.password) {
    updatedData.password = req.body.password;
  }

  const updatedCustomer = await CustomerSchema.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true } // Set the `new` option to return the updated document
  );

  if (req.file) {
    if (oldCustomer.image && oldCustomer.image !== 'default.jpg') {
      await fs.unlink(
        path.join(__dirname, '..', 'images', 'customers', oldCustomer.image),
        (err) => {
          if (err) throw err;
        }
      );
    }
    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
      if (err) throw err;
    });
  }

  res.status(200).json({
    data: {
      id: updatedCustomer._id,
      firstName: updatedCustomer.firstName,
      lastName: updatedCustomer.lastName,
      email: updatedCustomer.email,
      phoneNumber: updatedCustomer.phoneNumber,
      image: req.body.image,
      bannedAt: updatedCustomer.bannedAt,
      deactivatedAt: updatedCustomer.deactivatedAt,
      deletedAt: updatedCustomer.deletedAt,
    },
  });
});

exports.deactivateCustomer = AsyncHandler(async (req, res, next) => {
  const deactivatedAt = Date.now();
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { deactivatedAt }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({
    meesage: 'Customer is deactivated successfully',
    id: customer._id,
    deactivatedAt,
  });
});

exports.activateCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { deactivatedAt: null }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res
    .status(200)
    .json({ meesage: 'Customer is activated successfully', id: customer._id });
});

exports.banCustomer = AsyncHandler(async (req, res, next) => {
  const bannedAt = Date.now();
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { bannedAt }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({
    meesage: 'Customer is banned successfully',
    id: customer._id,
    bannedAt,
  });
});

exports.unbanCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { bannedAt: null }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res
    .status(200)
    .json({ meesage: 'Customer is unbanned successfully', id: customer._id });
});

exports.softDeleteCustomer = AsyncHandler(async (req, res, next) => {
  const deletedAt = Date.now();
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { deletedAt }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({
    meesage: 'Customer is soft deleted successfully',
    id: customer._id,
    deletedAt,
  });
});

exports.restoreCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate(
    { _id: req.params.id },
    { deletedAt: null }
  );
  if (!customer) return new ApiError('Customer not found!', 404);
  res
    .status(200)
    .json({ meesage: 'Customer is restored successfully', id: customer._id });
});

exports.deleteCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOne({ _id: req.params.id });
  if (!customer) return new ApiError('Customer not found!', 404);
  if (customer.image !== 'default.jpg') {
    await fs.unlink(
      path.join(__dirname, '..', 'images', 'customers', customer.image),
      (err) => {
        if (err) throw err;
      }
    );
  }
  await CustomerSchema.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: 'Customer deleted forever successfully',
    id: req.params.id,
  });
});

exports.customerForgotPassword =
  forgotPasswordController.forgotPassword(CustomerSchema);

exports.customerVerifyPassResetCode =
  forgotPasswordController.verifyPassResetCode(CustomerSchema);

exports.customerResetPassword =
  forgotPasswordController.resetPassword(CustomerSchema);

exports.getLoggedCustomerData = AsyncHandler(async (req, res, next) => {
  console.log(req.decodedToken.id);
  req.params.id = req.decodedToken.id;
  console.log(req.params.id);
  next();
});

exports.updateLoggedCustomerPassword = AsyncHandler(async (req, res, next) => {
  console.log(req.decodedToken.id);
  //1) update user password based on the user payload (req.user._id)
  const user = await CustomerSchema.findByIdAndUpdate(
    req.decodedToken.id,
    {
      $set: {
        password: await bcrypt.hash(req.body.password, saltRounds),
        passwordChangedAt: Date.now(),
      },
    },
    {
      new: true,
    }
  );
  //2)generate token
  const token = createToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.updateLoggedCustomerData = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  let oldImage;
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images/customers',
      req.body.image
    );
    oldImage = await CustomerSchema.findById(req.decodedToken.id, { image: 1 });
  }
  const updatedUser = await CustomerSchema.findByIdAndUpdate(
    req.decodedToken.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        address: {
          country: req.body.country,
          state: req.body.state,
          city: req.body.city,
          street: req.body.street,
          zip: req.body.zip,
        },
        image: req.body.image,
        gender: req.body.gender,
      },
    },
    { new: true }
  );
  if (!updatedUser) {
    throw new ApiError('Error happened while Updating Customer', 404);
  }

  if (req.file) {
    console.log(req.imgPath);
    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
      if (err) throw err;
    });

    const root = dirname(require.main.filename);
    const path = root + '/images/customers/' + oldImage.image;
    if (oldImage.image !== 'default.jpg') {
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
  res.status(200).json({ data: updatedUser });
});

exports.getFavoritePlaces = AsyncHandler(async (req, res, next) => {
    const customer = await CustomerSchema.findById(req.decodedToken.id);
    if (!customer) return new ApiError('Customer not found!', 404);
    console.log(customer.favoritePlaces);
    const places = await VendorSchema.find({ _id: { $in: customer.favoritePlaces } }).populate('category');
    res.status(200).json({ data: places });
});

exports.deleteLoggedCustomerData = AsyncHandler(async (req, res, next) => {
  await CustomerSchema.findOneAndUpdate(req.decodedToken.id, { active: false });
  res.status(200).json({ status: 'Your Account Deleted Successfully' });
});
