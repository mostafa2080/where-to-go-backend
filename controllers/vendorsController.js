const mongoose = require("mongoose");
require("../models/Vendor");

const Vendors = mongoose.model("vendor");

exports.getAllVendors = async (req, res, next) => {
  const vendors = await Vendors.find({});
  return res.status(200).json({
    status: "success",
    data: vendors,
  });
};

exports.getApprovedVendors = async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: true });
  res.status(200).json({
    status: "success",
    data: vendors,
  });
};

exports.getRejectedVendors = async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: false });
  res.status(200).json({
    status: "success",
    data: vendors,
  });
};

exports.getVendor = async (req, res, next) => {
  const vendor = await Vendors.find({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: vendor,
  });
};

exports.addVendor = async (req, res, next) => {
  console.log("before body");
  console.log(req.body);

  console.log("after body");
  // return res.json(req.body);
  const vendor = await new Vendors({
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
  return res.status(200).json({
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
        isApproved: req.body.isApproved,
      },
    }
  );
  return res.status(200).json({
    status: "success",
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
      status: "success",
      data: deletedVendor,
    });
  } else {
    next(new Error("No Vendor With This Id"));
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
      status: "success",
      data: restoredVendor,
    });
  } else {
    next(new Error("No Vendor With This Id"));
  }
};
