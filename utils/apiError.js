//@desc responsible for operational errors

class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
      this.isOperational = true; //predicted error
    }
  }
  
  //@desc exports ApiError
  module.exports = ApiError;
  