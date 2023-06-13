const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/apiError');

const getImage = (req, res, folder) => {
  const { filename } = req.params;
  const extension = filename.split('.')[1];
  const imagePath = path.join(__dirname, '..', 'images', folder, filename);

  res.setHeader('Content-Type', `image/${extension}`);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.setHeader('Content-Type', `image/jpg`);
      fs.createReadStream(
        path.join(__dirname, '..', 'images', folder, 'default.jpg')
      ).pipe(res);
    } else {
      fs.createReadStream(imagePath).pipe(res);
    }
  });
};

exports.getCustomerImage = (req, res) => {
  getImage(req, res, 'customers');
};

exports.getVendorImage = (req, res) => {
  getImage(req, res, 'vendors');
};

exports.getEmployeeImage = (req, res) => {
  getImage(req, res, 'employees');
};

exports.getFavicon = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'favicon.ico'));
};

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('File Must be An Image', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
  });
  return upload;
};

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
