const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
require("../models/Vendor");
require("../models/Tag");
const path = require("path");
const AsyncHandler = require("express-async-handler");
const forgotPasswordController = require("./forgetPasswordController");
const { uploadMixOfImages } = require("./imageController");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendEmail");
const { resetPassword } = require("./forgetPasswordController");

const Vendors = mongoose.model("vendor");
const Roles = mongoose.model("roles");
const Tags = mongoose.model("tag");

const greetingMessage = asyncHandler(async (data) => {
  const emailContent = `
    <html>
      <head>
        <style>/* Styles for the email content */</style>
      </head>
      <body>
        <div class="container">
          <h4>Wellcome ${data.firstName + " " + data.lastName} On Board </h4>
          <p>Congratlation for signing Up with ${data.email}  </p>
          <p>we 're sending this email to let you know that we have recieved your request for being a vendor </p>
          <p>and we will review your place details and within 24 - 48 Hours we will Respond </p>
        </div>
      </body>
    </html>`;
  const userEmail = data.email;
  try {
    await sendMail({
      email: userEmail,
      subject: "Greeting From Where To Go",
      message: emailContent,
    });
  } catch (error) {
    throw ApiError(error);
  }
});

exports.getAllVendors = AsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField || null;
  const sortOrder = req.query.sortOrder || "asc";
  const filters = req.query.filters || {};
  const searchQuery = req.query.search || "";
  const tagIds = filters.tags ? filters.tags.split(",") : []; // Split the tagIds string into an array

  const filterQuery = {};

  // Apply filters to the filterQuery object
  if (filters.category) {
    filterQuery.category = filters.category;
  }
  if (filters.isApproved !== undefined) {
    filterQuery.isApproved = filters.isApproved;
  }

  // Apply search query to the filterQuery object
  if (searchQuery) {
    filterQuery.$or = [
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { placeName: { $regex: searchQuery, $options: "i" } },
    ];
  }

  const sortQuery = {};
  if (sortField) {
    sortQuery[sortField] = sortOrder === "desc" ? -1 : 1;
  }

  try {
    // Find the tags that match the given tag IDs
    const tags = await Tags.find({ _id: { $in: tagIds } });

    // Extract the category IDs from the found tags
    const categoryIds = tags.map((tag) => tag.category);

    // Add the category IDs to the filter query
    if (categoryIds.length > 0) {
      filterQuery.category = { $in: categoryIds };
    }

    const [vendors, total] = await Promise.all([
      Vendors.find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortQuery)
        .populate("category"),
      Vendors.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: "success",
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
      status: "error",
      message: "Internal server error",
    });
  }
});

exports.getApprovedVendors = AsyncHandler(async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: true });
  res.status(200).json({
    status: "success",
    data: vendors,
  });
});

exports.getRejectedVendors = AsyncHandler(async (req, res, next) => {
  const vendors = await Vendors.find({ isApproved: false });
  res.status(200).json({
    status: "success",
    data: vendors,
  });
});

exports.getVendor = AsyncHandler(async (req, res, next) => {
  const vendor = await Vendors.findById(req.params.id)
    .populate("category")
    .exec();

  const tags = await Tags.find({ _id: vendor.category._id });
  vendor.tags = tags;

  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

exports.addVendor = asyncHandler(async (req, res, next) => {
  const vendorRole = await Roles.find({ name: "Vendor" });
  req.body.role = vendorRole._id;
  const document = await Vendors.create(req.body);
  greetingMessage(document);

  res.status(201).json({ data: document });
});

exports.updateVendor = asyncHandler(async (req, res, next) => {
  console.log("updating");
  const document = await Vendors.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!document) {
    return next(new ApiError("Document not found", 404));
  }
  res.status(200).json({ data: document });
});

exports.approveVendor = AsyncHandler(async (req, res, next) => {
  const document = await Vendors.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        isApproved: true,
      },
    }
  );
  req.body.email = document.email;
  req.body.modelType = "vendor";
  next();
});

exports.deactivateVendor = AsyncHandler(async (req, res, next) => {
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
});

exports.restoreVendor = AsyncHandler(async (req, res, next) => {
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
});

exports.uploadVendorImages = uploadMixOfImages([
  { name: "thumbnail", maxCount: 1 },
  {
    name: "gallery",
    maxCount: 5,
  },
]);

exports.processingImage = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.thumbnail) {
    const thumbnailFileName = `vendor-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.thumbnail[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, "../images/vendors/", thumbnailFileName));
    req.body.thumbnail = thumbnailFileName;
  }
  if (req.files && req.files.gallery) {
    req.body.gallery = [];
    await Promise.all(
      req.files.gallery.map(async (img, index) => {
        const imageName = `vendor-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, "../images/vendors/", imageName));

        // save images to DB
        req.body.gallery.push(imageName);
      })
    );
  }
  next();
});

exports.vendorForgotPassword = forgotPasswordController.forgotPassword(Vendors);

exports.vendorVerifyPassResetCode =
  forgotPasswordController.verifyPassResetCode(Vendors);

exports.vendorResetPassword = forgotPasswordController.resetPassword(Vendors);
