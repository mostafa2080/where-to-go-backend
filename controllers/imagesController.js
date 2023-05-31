const fs = require('fs');
const path = require('path');

const getImage = (req, res, folder) => {
    const { filename } = req.params;
    const extension = filename.split('.')[1];
    const imagePath = path.join(__dirname, '..', 'images', folder, filename);

    res.setHeader('Content-Type', `image/${extension}`);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.setHeader('Content-Type', `image/jpg`);
            fs.createReadStream(path.join(__dirname, '..', 'images', folder, 'default.jpg')).pipe(res);     
        }
        else {
            fs.createReadStream(imagePath).pipe(res);
        }
    })
};

exports.getCustomerImage = (req, res) => {
    getImage(req, res, 'customers');
}

exports.getVendorImage = (req, res) => {
    getImage(req, res, 'vendors');
}

exports.getEmployeeImage = (req, res) => {
    getImage(req, res, 'employees');
}
