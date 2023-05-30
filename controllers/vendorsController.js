const mongoose = require("mongoose");
require("../models/vendorsModel");

const Vendors = mongoose.model("vendors");

exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendors.find({});
    res.status(200).json({
      status: "success",
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendors.find({ _id: req.params.id });
    res.status(200).json({
      status: "success",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

exports.addVendor = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.updateVendor = async (req, res, next) => {
  try {
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
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.deactivateVendor = async (req, res, next) => {
  try {
    const deletedVendor = await Vendors.softDelete({
      _id: req.body.id,
    });
    res.status(200).json({
      status: "success",
      data: deletedVendor,
    });
  } catch (error) {
    next(error);
  }
};
