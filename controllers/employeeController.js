const mongoose = require('mongoose');
const AsyncHandler = require('express-async-handler');
const { dirname } = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");
const ApiError = require('../utils/apiError');
require('../models/Employee');
const path = require("path");

const Employees = mongoose.model('employees');
const Roles = mongoose.model('roles');

const saltRunds = 10;
const salt = bcrypt.genSaltSync(saltRunds);



exports.getAllEmployees = AsyncHandler( async (req, res, next) => {
    const allEmployees = await Employees.find({}).populate('role', {name:1});

    if(!allEmployees){
        throw new ApiError('no Employee found', 404);
    }

    res.status(200).json({data: allEmployees});
});


exports.getEmployeeById = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findById(req.params.id);

    if(!employee){
        throw new ApiError('no Employee found', 404);
    }

    res.status(200).json({data: employee});
});

// Create new Employee
exports.createEmployee = AsyncHandler( async (req, res, next) => {
    console.log(req.body);
    if (req.file) {
        req.body.image = Date.now() + path.extname(req.file.originalname);
        req.imgPath = path.join(__dirname, '..', 'images/employees', req.body.image);
    }
    else {
        req.body.image = 'default.jpg';
    }

    const role = await Roles.findOne({name: req.body.role}, {_id: 1});

    const obj = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,salt),
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
    }

    const employee = await Employees.create(obj);

    if(!employee){
        throw new ApiError('Error happened while Creating Employee', 404);
    }

    await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
        if (err) throw err
    })

    res.status(200).json({data: employee});
});


// Update Employee
exports.updateEmployee = AsyncHandler( async (req, res, next) => {
    let oldEmpImage;
    if (req.file){
        req.body.image = Date.now() + path.extname(req.file.originalname);
        req.imgPath = path.join(__dirname, '..', 'images/employees', req.body.image);
        oldEmpImage = await Employees.findById(req.params.id, {image: 1});
    }

    if (req.body.role){
        const role = await Roles.findOne({name: req.body.role}, {_id: 1});
        req.body.role = role._id;
    }


    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            address: {
                country: req.body.country,
                street: req.body.street,
                city: req.body.city,
            },
            gender: req.body.gender,
            hireDate: req.body.hireDate,
            salary: req.body.salary,
            role: req.body.role,
            image: req.body.image,
        }
    },{new: true});

    if(!employee){
        throw new ApiError('Error happened while Updating Employee', 404);
    }

    if(req.file){
        console.log(req.imgPath);
        await fs.writeFile(req.imgPath, req.file.buffer, (err) => {
            if (err) throw err
        })

        const root = dirname(require.main.filename);
        const path = root + "/images/employees/" + oldEmpImage.image;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    res.status(200).json({mssg:'Updated',Data: employee});

});


// Delete Employee
exports.deleteEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndDelete({_id: req.params.id});

    if(!employee){
        throw new ApiError('Error happened while Deleting Employee', 404);
    }

    const root = dirname(require.main.filename);
    const path = root + "/images/employees/" + employee.image;
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
            password: bcrypt.hashSync(request.body.password,salt),
        }
    });

    if(!employee){
        throw new ApiError('Error happened while Resetting Password', 404);
    }

    res.status(200).json({mssg:'Password Reseted',oldData: employee});
});



// Ban Employee
exports.banEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            bannedAtt: Date.now(),
        }
    },{new:true}).populate('role', {name:1});

    if(!employee){
        throw new ApiError('Error happened while Banning Employee', 404);
    }

    res.status(200).json({mssg:'Employee Banned',employee: employee});
});

// Unban Employee
exports.unbanEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            bannedAtt: null,
        }
    },{new:true}).populate('role', {name:1});

    if(!employee){
        throw new ApiError('Error happened while Unbanning Employee', 404);
    }

    res.status(200).json({mssg:'Employee Unbanned',employee: employee});
});

// deactivate Employee
exports.deactivateEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            deactivatedAt: Date.now(),
        }
    },{new:true}).populate('role', {name:1});

    if(!employee){
        throw new ApiError('Error happened while Deactivating Employee', 404);
    }

    res.status(200).json({mssg:'Employee Deactivated',employee: employee});
});

// activate Employee
exports.activateEmployee = AsyncHandler( async (req, res, next) => {
    const employee = await Employees.findOneAndUpdate({_id: req.params.id},{
        $set: {
            deactivatedAt: null,
        },
    },{new:true}).populate('role', {name:1});

    if(!employee){
        throw new ApiError('Error happened while Activating Employee', 404);
    }

    res.status(200).json({mssg:'Employee Activated',employee: employee});
});

// filter Employee
exports.filterEmployee = AsyncHandler( async (req, res, next) => {
    const queryStr = JSON.stringify(req.query);

    const employees = await Employees.find(JSON.parse(queryStr));

    if(!employees){
        throw new ApiError('Error happened while Filtering Employee', 404);
    }

    res.status(200).json({data: employees});
});