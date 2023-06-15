const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const customerModel = require('../models/Customer');

require('../models/Customer');
require('../models/Vendor');
require('../models/Employee');
require('../models/Role');

const VendorModel = mongoose.model('vendor');
const EmployeeModel = mongoose.model('employees');
const RoleModel = mongoose.model('roles');

const saltRunds = 10;
const salt = bcrypt.genSaltSync(saltRunds);

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//=======================================================================================//
//====================== Starting Login For All System Users & Admins ===================//
//=======================================================================================//

// Admins(super admin & employees) Login ...
exports.adminLogin = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeModel.findOne({ email: req.body.email });
  if (!employee) {
    return next(
      new ApiError('No such account exists, Try to reqister first...!', 404)
    );
  }
  if (bcrypt.compareSync(req.body.password, employee.password)) {
    let roleName = '';

    const role = await RoleModel.findOne({ _id: employee.role });
    if (role) {
      roleName = role.name;
    }

    const token = jwt.sign(
      { id: employee._id, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      Message: 'Authenticated',
      token,
      role: roleName,
    });
  } else {
    return next(
      new ApiError('Invalid credentials, try to login again...!', 401)
    );
  }
});

// Vendor Login ...
exports.vendorLogin = asyncHandler(async (req, res, next) => {
  const vendor = await VendorModel.findOne({ email: req.body.email });
  if (!vendor) {
    return next(
      new ApiError('No such account exists, Try to reqister first...!', 404)
    );
  }
  if (bcrypt.compareSync(req.body.password, vendor.password)) {
    let roleName = '';

    const role = await RoleModel.findOne({ _id: vendor.role });
    if (role) {
      roleName = role.name;
    }

    const token = jwt.sign(
      { id: vendor._id, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      Message: 'Authenticated',
      token,
      role: roleName,
      id: vendor._id,
    });
  } else {
    return next(
      new ApiError('Invalid credentials, try to login again...!', 401)
    );
  }
});

// Customer Login ...
exports.customerLogin = asyncHandler(async (req, res, next) => {
  const customer = await customerModel.findOne({ email: req.body.email });
  if (!customer) {
    return next(
      new ApiError('No such account exists, Try to reqister first...!', 404)
    );
  }
  if (bcrypt.compareSync(req.body.password, customer.password)) {
    let roleName = '';

    const role = await RoleModel.findOne({ _id: customer.role });
    if (role) {
      roleName = role.name;
    }

    const token = jwt.sign(
      { id: customer._id, role: roleName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      Message: 'Authenticated',
      token,
      role: roleName,
    });
  } else {
    return next(
      new ApiError('Invalid credentials, try to login again...!', 401)
    );
  }
});
