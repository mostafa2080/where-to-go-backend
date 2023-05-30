const mongoose = require("mongoose");
require("../models/Vendor");

const Vendors = mongoose.model("vendors");

exports.getAllVendors = async (req, res, next) => {
  const vendors = await Vendors.find({});
  res.status(200).json({
    status: "success",
    data: vendors,
  });
};

exports.getApprovedVendors = async (req, res, next) =>{
    const vendors = await Vendors.find({ isApproved: true});
    res.status(200).json({
      status: "success",
      data: vendors,
    });
}

exports.getRejectedVendors = async (req, res, next) =>{
    const vendors = await Vendors.find({ isApproved: false});
    res.status(200).json({
      status: "success",
      data: vendors,
    });
}

exports.getVendor = async (req, res, next) => {
  const vendor = await Vendors.find({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: vendor,
  });
};

exports.addVendor = async (req, res, next) => {
  const vendor = new Vendors({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    placeName: req.body.placeName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    gallery: req.body.gallery,
  });

  await vendor.save();
  res.status(200).json({
    status: "success",
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
          thumbnail: req.body.thumbnail,
          gallery: req.body.gallery,
          isApproved: req.body.isApproved
        },
      }
    );
    res.status(200).json({
      status: "success",
      data: vendor,
    });
};

exports.deactivateVendor = async (req, res, next) => {
  const deletedVendor = await Vendors.softDelete({
    _id: req.params.id,
  });

  if (deletedVendor > 0) {
    res.status(200).json({
      status: "success",
      data: deletedVendor,
    });
  } else {
    next(new Error("No Vendor With This Id"));
  }
};

exports.restoreVendor = async (req, res, next) => {
  const restoredVendor = await Vendors.restore({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: restoredVendor,
  });
};
