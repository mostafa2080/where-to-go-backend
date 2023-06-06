const mongoose = require('mongoose');
const ExtendSchema = require('mongoose-extend-schema');
const User = require('./User');

const EmployeesSchema = ExtendSchema(User, {
    name: {
        type: String,
        trim: true,
        required: [true, "Please Enter Employee Name"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Please Enter Date Of Birth"],
    },
    gender: {
        type: String,
        enum:["Male","Female"]
    },
    hireDate: {
        type: Date,
        required: [true, "Please Enter Hire Date"],
    },
    deactivationDate: {
        type: Date,
        default: null
    },
    bannedAtt: {
        type: Date,
        default: null
    },
    image: {
        type: String,
        required: [true, "Please Upload Employee Image"],
    },
    salary: {
        type: Number,
        required: [true, "Please Enter Salary"],
    }
}, { timestamps: true });

mongoose.model('employees', EmployeesSchema);