const ApiError = require("../utils/apiError");

exports.Admin = (req, res, next) => {
    if(req.decodedToken.payload.role === 'Admin'){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.EmployeeOrAbove = (req, res, next) => {
    if(req.decodedToken.payload.role === 'Admin' || req.decodedToken.payload.role === 'Employee'){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.VendorOrAbove = (req, res, next) => {
    if(req.decodedToken.payload.role === 'Admin' || req.decodedToken.payload.role=== "Employee" || req.decodedToken.payload.role === "Vendor"){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}

exports.CustomerOrAbove = (req, res, next) => {
    if(
        req.decodedToken.payload.role === 'Admin' ||
        req.decodedToken.payload.role === 'Employee' ||
        req.decodedToken.payload.role === 'Vendor' ||
        req.decodedToken.payload.role === 'Customer'
    ){
        next();
    }else{
        next(new ApiError('UnAuthorized..!', 403));
    }
}