const mongoose = require('mongoose');

const EmployeesSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please Enter Employee Name"],
    },
    email: {
        type: String,
        unique: [true, "Email Has To Be Unique"],
        required: [true, "Please Enter Contact Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Please Enter Date Of Birth"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Please Enter Contact Phone Number"],
    },
    address: {
        type: Object,
        required: [true, "Please Enter Address"],
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
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: [true, "Please Enter Role"],
    }
}, { timestamps: true });

mongoose.model('employees', EmployeesSchema);