const fs = require('fs');

const sendErrForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const deleteUploadedFiles = (req, res, next) => {
  if (req.body.image) {
    fs.unlink(req.body.image, (err) => {
      if (err) throw err;
    })
    console.log('image deleted successfully');
  }
  next();
}

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrForDev(err, res);
  } else {
    sendErrForProd(err, res);
  }
  deleteUploadedFiles(req, res, next);
};
module.exports = globalError;
