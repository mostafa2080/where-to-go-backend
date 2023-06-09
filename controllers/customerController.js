const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

require('../models/Customer');
require('../models/Role');
const ApiError = require('../utils/apiError');

const CustomerSchema = mongoose.model('customers');
const RoleSchema = mongoose.model('roles');
const saltRounds = 10;

exports.getAllCustomers = AsyncHandler(async (req, res, next) => {
  const allCustomers = await CustomerSchema.find({}, {
    id: '$_id',
    firstName: 1,
    lastName: 1,
    phoneNumber: 1,
    email: 1,
    image: 1,
    bannedAt: 1,
    _id: 0
  });
  if (!allCustomers) return new ApiError('No customers found!', 404);
  res.status(200).json({ data: allCustomers });
});

exports.getCustomerById = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.find({ _id: req.params.id });
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({ data: customer });
})

exports.addCustomer = AsyncHandler(async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  const role = await RoleSchema.findOne({ name: 'Customer' }, { _id: 1 });

  if (req.file) {
    req.body.image = path.join('customers', Date.now() + path.extname(req.file.originalname));
    req.imgPath = path.join(__dirname, '..', 'images', req.body.image);
  }
  else {
    req.body.image = 'default.jpg';
  }

  const customer = await new CustomerSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
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
      if (err) throw err
    })
  }

  res.status(201).json({ data: customer });
})

exports.updateCustomer = AsyncHandler(async (req, res, next) => {
  // if (req.body.password) {
  //   req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  // }

  // if (req.file) {
  //   req.body.image = path.join('customers', Date.now() + path.extname(req.file.originalname));
  //   req.imgPath = path.join(__dirname, '..', 'images', req.body.image);
  // }
  // else {
  //   req.body.image = 'default.jpg';
  // }

  // const customer = await new CustomerSchema({
  //   first_name: req.body.first_name,
  //   last_name: req.body.last_name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   phone_number: req.body.phone_number,
  //   address: {
  //     country: req.body.country,
  //     state: req.body.state,
  //     city: req.body.city,
  //     street: req.body.street,
  //     zip: req.body.zip,
  //   },
  //   date_of_birth: req.body.date_of_birth,
  //   gender: req.body.gender,
  //   image: req.body.image,
  //   role: role._id,
  // });
  // await customer.save();

  // if (req.file) {
  //   await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
  //     if (err) throw err
  //   })
  // }

  // res.status(201).json({ data: customer });
})

exports.deactivateCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate({ _id: req.params.id }, { deactivatedAt: Date.now() });
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({ meesage: 'Customer is deactivated successfully' });
})

exports.activateCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate({ _id: req.params.id }, { deactivatedAt: null });
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({ meesage: 'Customer is activated successfully' });
})

exports.banCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate({ _id: req.params.id }, { bannedAt: Date.now() });
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({ meesage: 'Customer is banned successfully' });
})

exports.unbanCustomer = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.findOneAndUpdate({ _id: req.params.id }, { bannedAt: null });
  if (!customer) return new ApiError('Customer not found!', 404);
  res.status(200).json({ meesage: 'Customer is unbanned successfully' });
})
