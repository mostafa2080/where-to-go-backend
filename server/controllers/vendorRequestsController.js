const mongoose = require("mongoose");
require("../models/vendorRequestsModel");

const VendorRequests = mongoose.model("vendorRequests");

exports.getAllVendorRequests = async (req, res, next) => {
  const vendorRequests = await VendorRequests.find({});
  res.status(200).json({
    status: "success",
    data: vendorRequests,
  });
};

exports.getVendorRequest = async (req, res, next) => {
  const vendorRequest = await VendorRequests.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: vendorRequest,
  });
};

exports.addVendorRequest = async (req, res, next) => {
  const vendorRequest = new VendorRequests({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    placeName: req.body.placeName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    gallery: req.body.gallery,
  });

  await vendorRequest.save();
  res.status(201).json({
    status: "success",
    data: vendorRequest,
  });
};

exports.updateVendorRequest = async (req, res, next) => {
  const vendorRequest = await VendorRequests.updateOne(
    {
      _id: req.params.id,
    },
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      placeName: req.body.placeName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      gallery: req.body.gallery,
    }
  );

  res.status(200).json({
    status: "success",
    data: vendorRequest,
  });
};

const deleteVendorRequest = async (req, res, next) => {
  const deletedVendor = await VendorRequests.deleteOne({ _id: req.params.id });
  return deletedVendor;
};
