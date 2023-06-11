const mongoose = require('mongoose');
require('../models/Vendor');
const path = require('path');
const fs = require('fs');

const Vendors = mongoose.model('vendor');

exports.getAllVendors = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const [vendors, total] = await Promise.all([
      Vendors.find({}).skip(skip).limit(limit).populate('category'),
      Vendors.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: 'success',
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
      data: vendors,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getApprovedVendors = async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: true });
  res.status(200).json({
    status: 'success',
    data: vendors,
  });
};

exports.getRejectedVendors = async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: false });
  res.status(200).json({
    status: 'success',
    data: vendors,
  });
};

exports.getVendor = async (req, res, next) => {
  const vendor = await Vendors.find({ _id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: vendor,
  });
};

exports.addVendor = async (req, res, next) => {
  console.log(req.body);
  if (req.files) {
    if (req.files.thumbnail) {
      req.body.thumbnail =
        Date.now() + path.extname(req.files.thumbnail[0].originalname);
      req.thumbnailPath = path.join(
        __dirname,
        '..',
        'images',
        'vendors',
        req.body.thumbnail
      );
    }
    if (req.files.gallery) {
      req.body.gallery = [];

      req.files.gallery.forEach((img) => {
        req.body.gallery.push(Date.now() + path.extname(img.originalname));
      });

      req.gallery = [];
      req.body.gallery.forEach((image) => {
        req.gallery.push(
          path.join(__dirname, '..', 'images', 'vendors', image)
        );
      });
    }
  } else {
    req.body.thumbnail = 'default.jpg';
  }

  const vendor = await new Vendors({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    placeName: req.body.placeName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    description: req.body.description,
    category: req.body.category,
    thumbnail: req.body.thumbnail,
    gallery: req.body.gallery,
  });

  await vendor.save();

  if (req.files.thumbnail) {
    await fs.writeFile(
      req.thumbnailPath,
      req.files.thumbnail[0].buffer,
      (err) => {
        if (err) throw err;
      }
    );
  }

  if (req.files.gallery) {
    req.files.gallery.forEach(async (img, index) => {
      await fs.writeFile(req.gallery[index], img.buffer, (err) => {
        if (err) throw err;
      });
      console.log(index);
    });
  }

  return res.status(200).json({
    status: 'success',
    data: vendor,
  });
};

exports.updateVendor = async (req, res, next) => {
  const vendor = await Vendors.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        placeName: req.body.placeName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        category: req.body.description,
        thumbnail: req.body.thumbnail,
        gallery: req.body.gallery,
        isApproved: req.body.isApproved,
      },
    }
  );
  return res.status(200).json({
    status: 'success',
    data: vendor,
  });
};

exports.deactivateVendor = async (req, res, next) => {
  const deletedVendor = await Vendors.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        deactivatedAt: Date.now(),
      },
    }
  );

  if (deletedVendor.modifiedCount > 0) {
    res.status(200).json({
      status: 'success',
      data: deletedVendor,
    });
  } else {
    next(new Error('No Vendor With This Id'));
  }
};

exports.restoreVendor = async (req, res, next) => {
  const restoredVendor = await Vendors.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        deactivatedAt: null,
      },
    }
  );
  if (restoredVendor.modifiedCount > 0) {
    res.status(200).json({
      status: 'success',
      data: restoredVendor,
    });
  } else {
    next(new Error('No Vendor With This Id'));
  }
};
