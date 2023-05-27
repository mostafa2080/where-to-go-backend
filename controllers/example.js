const mongoose = require('mongoose');

const ApiError = require('../utils/apiError');

const EmployeeModel = require('employee-model');

const AsyncHandler = require('express-async-handler');

exports.getAllEmployees = AsyncHandler(async (req, res, next) => {
  const allEmployess = await employeeModel.find({});

  if (!this.getAllEmployees) {
    return new ApiError('no Employee found', 404);
  }

  res.status(200).json({ data: allEmployess });
});
