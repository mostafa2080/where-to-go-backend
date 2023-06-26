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

const Role = require("../models/Role");

exports.authorize = (requiredPermissions) => async (req, res, next) => {
    try {
      const userRole = req.decodedToken.payload.role;
      const role = await Role.findOne({ name: userRole });

      if (!role) {
        throw new ApiError('Role not found..!', 403);
      }

      const userPermissions = role.permissions.map(permission => permission.name.toString());
      console.log(userPermissions);

      const hasPermission = requiredPermissions.every(permission =>
        userPermissions.includes(permission)
      );

      if (hasPermission) {
        next();
      } else {
        throw new ApiError('Unauthorized..!', 403);
      }
    } catch (error) {
      next(error);
    }
  };
