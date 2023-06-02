const ApiError = require("../utils/apiError");

exports.Admin = (req, res, next) => {
    if(req.decodedToken.role === 'Admin'){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.EmployeeOrAbove = (req, res, next) => {
    if(req.decodedToken.role === 'Admin' || req.decodedToken.role === 'Employee'){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.VendorOrAbove = (req, res, next) => {
    if(req.decodedToken.role === 'Admin' || req.decodedToken.role=== "Employee" || req.decodedToken.role === "Vendor"){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.CustomerOrAbove = (req, res, next) => {
    if(
        req.decodedToken.role === 'Admin' ||
        req.decodedToken.role === 'Employee' ||
        req.decodedToken.role === 'Vendor' ||
        req.decodedToken.role === 'Customer'
    ){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}