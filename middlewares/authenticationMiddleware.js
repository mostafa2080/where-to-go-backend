const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

module.exports = (req, res, next) => {
    try{
        const token = req.get('authorization').split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.decodedToken = decodedToken;
        next();
    }catch(error){
        next(new ApiError('U are not authenticated...!', 401));
    }
}