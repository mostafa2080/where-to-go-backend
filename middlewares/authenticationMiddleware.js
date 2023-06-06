const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

module.exports = (req, res, next) => {
    try{
        let token = req.get('authorization').split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        res.decodedToken = decodedToken;
        next();
    }catch(error){
        next(new ApiError('U are not authenticated...!', 401));
    }
}