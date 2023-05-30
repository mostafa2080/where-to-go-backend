const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');

require('../models/Customer');

const CustomerSchema = mongoose.model('customers');

exports.getAllCustomers = AsyncHandler(async (req, res, next) => {
  const allCustomers = await CustomerSchema.find({});
  
  if (!allCustomers) {
    return new ApiError('No customers found!', 404);
  }
  
  res.status(200).json({ data: allCustomers });
});

exports.getCustomerById = AsyncHandler(async (req, res, next) => {
  const customer = await CustomerSchema.find({ _id: req.params.id });
  
  if (!customer) {
    return new ApiError('Customer not found!', 404);
  }
  
  res.status(200).json({ data: customer });
})
