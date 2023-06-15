const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { dirname } = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const ApiError = require('../utils/apiError');
const sendMail = require('../utils/sendEmail');

require('../models/Employee');
const forgotPasswordController = require('./forgetPasswordController');

const Employees = mongoose.model('employees');
const Roles = mongoose.model('roles');

const saltRunds = 10;
const salt = bcrypt.genSaltSync(saltRunds);

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
              <h4>Welcome ${`${data.name}`} On Board</h4>
              <p>We are thrilled to have you on board and look forward to working with you. If you have any questions or need assistance, feel free to reach out to any member of our team.</p>
            </div>
          </body>
        </html>`;
  const userEmail = data.email;
  try {
    await sendMail({
      email: userEmail,
      subject: 'Greeting From Where To Go',
      message: emailContent,
    });
  } catch (error) {
    throw ApiError(error);
  }
});

exports.getAllEmployees = AsyncHandler(async (req, res, next) => {
  const allEmployees = await Employees.find(
    {},
    {
      password: 0,
      passwordResetVerified: 0,
    }
  )
    .populate('role', 'name')
    .select('-__v');

  if (!allEmployees) {
    throw new ApiError('no Employee found', 404);
  }

  res.status(200).json({ data: allEmployees });
});

exports.getEmployeeById = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findById(req.params.id);

  if (!employee) {
    throw new ApiError('no Employee found', 404);
  }

  res.status(200).json({ data: employee });
});

// Create new Employee
exports.createEmployee = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images/employees',
      req.body.image
    );
  } else {
    req.body.image = 'default.jpg';
  }

  const role = await Roles.findOne({ name: req.body.role }, { _id: 1 });

  const obj = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    dateOfBirth: req.body.dateOfBirth,
    phoneNumber: req.body.phoneNumber,
    address: {
      country: req.body.country,
      street: req.body.street,
      city: req.body.city,
    },
    gender: req.body.gender,
    hireDate: req.body.hireDate,
    image: req.body.image,
    salary: req.body.salary,
    role: role._id,
  };

  const employee = await Employees.create(obj);

  if (!employee) {
    path;
    throw new ApiError('Error happened while Creating Employee', 404);
  }

  await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
    if (err) throw err;
  });
  greetingMessage(employee);
  res.status(200).json({ data: employee });
});

// Update Employee
exports.updateEmployee = AsyncHandler(async (req, res, next) => {
  let oldEmpImage;
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images/employees',
      req.body.image
    );
    oldEmpImage = await Employees.findById(req.params.id, { image: 1 });
  }

  if (req.body.role) {
    const role = await Roles.findOne({ name: req.body.role }, { _id: 1 });
    req.body.role = role._id;
  }

  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber,
        address: {
          country: req.body.country,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
        },
        gender: req.body.gender,
        hireDate: req.body.hireDate,
        salary: req.body.salary,
        role: req.body.role,
        image: req.body.image,
      },
    },
    { new: true }
  );

  if (!employee) {
    throw new ApiError('Error happened while Updating Employee', 404);
  }

  if (req.file) {
    console.log(req.imgPath);
    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
      if (err) throw err;
    });

    const root = dirname(require.main.filename);
    const path = root + '/images/employees/' + oldEmpImage.image;
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.status(200).json({ mssg: 'Updated', Data: employee });
});

// Delete Employee
exports.deleteEmployee = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndDelete({ _id: req.params.id });

  if (!employee) {
    throw new ApiError('Error happened while Deleting Employee', 404);
  }

  const root = dirname(require.main.filename);
  const path = `${root}/images/employees/${employee.image}`;
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).json({ mssg: 'Deleted', oldData: employee });
});

// Reset Password
exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        password: bcrypt.hashSync(req.body.password, salt),
      },
    }
  );

  if (!employee) {
    throw new ApiError('Error happened while Resetting Password', 404);
  }

  res.status(200).json({ mssg: 'Password Reseted', oldData: employee });
});

// Ban Employee
exports.banEmployee = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        bannedAtt: Date.now(),
      },
    },
    { new: true }
  ).populate('role', { name: 1 });

  if (!employee) {
    throw new ApiError('Error happened while Banning Employee', 404);
  }

  res.status(200).json({ mssg: 'Employee Banned', employee: employee });
});

// Unban Employee
exports.unbanEmployee = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        bannedAtt: null,
      },
    },
    { new: true }
  ).populate('role', { name: 1 });

  if (!employee) {
    throw new ApiError('Error happened while Unbanning Employee', 404);
  }

  res.status(200).json({ mssg: 'Employee Unbanned', employee: employee });
});

// deactivate Employee
exports.deactivateEmployee = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        deactivatedAt: Date.now(),
      },
    },
    { new: true }
  ).populate('role', { name: 1 });

  if (!employee) {
    throw new ApiError('Error happened while Deactivating Employee', 404);
  }

  res.status(200).json({ mssg: 'Employee Deactivated', employee: employee });
});

// activate Employee
exports.activateEmployee = AsyncHandler(async (req, res, next) => {
  const employee = await Employees.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        deactivatedAt: null,
      },
    },
    { new: true }
  ).populate('role', { name: 1 });

  if (!employee) {
    throw new ApiError('Error happened while Activating Employee', 404);
  }

  res.status(200).json({ mssg: 'Employee Activated', employee: employee });
});

// filter Employee
exports.filterEmployee = AsyncHandler(async (req, res, next) => {
  const queryStr = JSON.stringify(req.query);

  const employees = await Employees.find(JSON.parse(queryStr));

  if (!employees) {
    throw new ApiError('Error happened while Filtering Employee', 404);
  }

  res.status(200).json({ data: employees });
});

exports.employeeForgotPassword =
  forgotPasswordController.forgotPassword(Employees);

exports.employeeVerifyPassResetCode =
  forgotPasswordController.verifyPassResetCode(Employees);

exports.employeeResetPassword =
  forgotPasswordController.resetPassword(Employees);

exports.getLoggedEmployeeData = AsyncHandler(async (req, res, next) => {
  req.params.id = req.decodedToken.id;
  next();
});


exports.updateLoggedEmployeePassword = AsyncHandler(async (req, res, next) => {
  // 1) Update user password based on the user payload (req.user._id)
  const user = await Employees.findByIdAndUpdate(
    req.decodedToken.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Throw an error if no user is found
  if (!user) {
    throw new ApiError('No user found', 404);
  }

  // 2) Generate token
  const token = createToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.updateLoggedEmployeeData = AsyncHandler(async (req, res, next) => {
  let oldEmpImage;
  if (req.file) {
    req.body.image = Date.now() + path.extname(req.file.originalname);
    req.imgPath = path.join(
      __dirname,
      '..',
      'images/employees',
      req.body.image
    );
    oldEmpImage = await Employees.findById(req.decodedToken.id, { image: 1 });
  }

  // Prepare the updated data for the user
  const updatedData = {
    name: req.body.name,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    phoneNumber: req.body.phoneNumber,
    address: {
      country: req.body.country,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    },
    gender: req.body.gender,
  };

  // Add the image field only if it's present in the request
  if (req.body.image) {
    updatedData.image = req.body.image;
  }

  // Update user data based on the user payload (req.user._id)
  const updatedUser = await Employees.findByIdAndUpdate(
    req.decodedToken.id,
    updatedData,
    { new: true }
  );

  // Throw an error if no user is found
  if (!updatedUser) {
    throw new ApiError('No user found', 404);
  }

  if (req.file) {
    console.log(req.imgPath);
    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
      if (err) throw err;
    });

    const root = dirname(require.main.filename);
    const imagePath = root + '/images/employees/' + oldEmpImage.image;
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.status(200).json({ data: updatedUser });
});

exports.deleteLoggedEmployeeData = AsyncHandler(async (req, res, next) => {
  // Update user data to set active: false based on the user payload (req.user._id)
  const updatedUser = await Employees.findOneAndDelete({
    _id: req.decodedToken.id,
  });
  const root = dirname(require.main.filename);
  const path = `${root}/images/employees/${updatedUser.image}`;
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });
  // Throw an error if no user is found
  if (!updatedUser) {
    throw new ApiError('No user found', 404);
  }

  res.status(200).json({ status: 'Your Account Deleted Successfully', DeletedData : updatedUser });
});
