const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { dirname } = require('path');
const fs = require('fs');
require('../models/Employee');

const Employees = mongoose.model('employees');




exports.getAllEmployees = AsyncHandler( async (req, res, next) => {
    const allEmployees = await Employees.find({});

    if(!allEmployees){
        return new ApiError('no Employee found', 404);
    }

    res.status(200).json({data: allEmployees});
});


exports.getEmployeeById = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findById(req.params.id);

    if(!employee){
        return new ApiError('no Employee found', 404);
    }

    res.status(200).json({data: employee});
});

// Create new Employee
exports.createEmployee = AsyncHandler( async (req, res, next) => {
    const obj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        gender: req.body.gender,
        hireDate: req.body.hireDate,
        image: req.file.filename,
        salary: req.body.salary,
        role: req.body.role
    }

    const employee = await Employees.create(obj);

    if(!employee){
        return new ApiError('Error happened while Creating Employee', 404);
    }

    res.status(200).json({data: employee});
});


// Update Employee
exports.updateEmployee = AsyncHandler( async (req, res, next) => {
    if(req.file !== undefined){
        req.body.image = req.file.filename;
    }
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            gender: req.body.gender,
            hireDate: req.body.hireDate,
            salary: req.body.salary,
            role: req.body.role,
            image: req.body.image,
        }
    });

    if(!employee){
        const root = dirname(require.main.filename);
        const path = root + "/images/Employee/" + req.body.image;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        return new ApiError('Error happened while Updating Employee', 404);
    }

    if(req.file !== undefined){
        const root = dirname(require.main.filename);
        const path = root + "/images/Employee/" + employee.image;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    res.status(200).json({mssg:'Updated',oldData: employee});
});


// Delete Employee
exports.deleteEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndDelete({_id: req.params.id});

    if(!employee){
        return new ApiError('Error happened while Deleting Employee', 404);
    }

    const root = dirname(require.main.filename);
    const path = root + "/images/Employee/" + employee.image;
    fs.unlink(path, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.status(200).json({mssg:'Deleted',oldData: employee});
});


// Reset Password
exports.resetPassword = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            password: req.body.password,
        }
    });

    if(!employee){
        return new ApiError('Error happened while Resetting Password', 404);
    }

    res.status(200).json({mssg:'Password Reseted',oldData: employee});
});



// Ban Employee
exports.banEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            bannedAtt: Date.now(),
        }
    });

    if(!employee){
        return new ApiError('Error happened while Banning Employee', 404);
    }

    res.status(200).json({mssg:'Employee Banned'});
});

// Unban Employee
exports.unbanEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            bannedAtt: null,
        }
    });

    if(!employee){
        return new ApiError('Error happened while Unbanning Employee', 404);
    }

    res.status(200).json({mssg:'Employee Unbanned'});
});

// deactivate Employee
exports.deactivateEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            deactivationDate: Date.now(),
        }
    });

    if(!employee){
        return new ApiError('Error happened while Deactivating Employee', 404);
    }

    res.status(200).json({mssg:'Employee Deactivated'});
});

// activate Employee
exports.activateEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            deactivationDate: null,
        }
    });

    if(!employee){
        return new ApiError('Error happened while Activating Employee', 404);
    }

    res.status(200).json({mssg:'Employee Activated'});
});