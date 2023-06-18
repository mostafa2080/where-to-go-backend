const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const io = require("socket.io-client");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const AsyncHandler = require("express-async-handler");
const forgotPasswordController = require("./forgetPasswordController");
const { uploadMixOfImages } = require("./imageController");
const ApiError = require("../utils/apiError");
const sendMail = require("../utils/sendEmail");

require("../models/Vendor");
require("../models/Tag");
require("../models/Category");
require("../models/Notification");

const socket = io("http://localhost:8001");
const Notification = mongoose.model("notification");
const Vendors = mongoose.model("vendor");
const Roles = mongoose.model("roles");
const Tags = mongoose.model("tag");
const Category = mongoose.model("category");
const Review = require("../models/Review");

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const greetingMessage = AsyncHandler(async (data) => {
  const emailContent = `
    <html>
      <head>
        <style>
          .container {
            background-color: #f2f2f2;
            padding: 20px;
            border-radius: 5px;
          }
          
          h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          p {
            color: #666;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome ${data.firstName} ${data.lastName} on Board</h1>
          <p>Congratulations on signing up with ${data.email}!</p>
          <p>We are reaching out to inform you that we have received your request to become a vendor.</p>
          <p>Our team will carefully review the details of your place, and you can expect a response within 24-48 hours.</p>
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
    throw new ApiError("Sending Mail Failed Please Try Again.... ", 400);
  }
});

const getAllVendors = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField || null;
  const sortOrder = req.query.sortOrder || "asc";
  const filters = req.query.filters || {};
  const searchQuery = req.query.search || "";
  const categoryName = req.query.category || "";
  const tagSearchQuery = req.query.tags || "";

  const tagIds = filters.tags ? filters.tags.split(",") : [];

  const filterQuery = {};

  if (filters.isApproved !== undefined) {
    filterQuery.isApproved = filters.isApproved;
  }

  // Add rating filter based on the Review collection
  if (filters.rating) {
    const ratingRange = filters.rating.split(",");
    const minRating = parseFloat(ratingRange[0]);
    const maxRating = parseFloat(ratingRange[1]);

    if (!isNaN(minRating) && !isNaN(maxRating)) {
      const reviewFilter = {
        avgRate: {
          $gte: minRating,
          $lte: maxRating,
        },
      };

      // Get the placeIds from the reviews with the specified rating
      // const reviewPlaceIds = await Review.distinct("placeId", reviewFilter);

      // Get the placeIds from the reviews with the specified minRating, maxRating
      // const reviewPlaceIds = await Vendors.distinct("_id", reviewFilter);
      // Get the placeIds from the reviews with the specified minRating, maxRating
      const reviewPlaceIds = await Vendors.distinct("_id", reviewFilter);

      // Add the filtered placeIds to the filterQuery
      filterQuery._id = { $in: reviewPlaceIds };
    }
  }

  // Apply search query to the filterQuery object
  if (searchQuery) {
    filterQuery.$or = [
      { firstName: { $regex: searchQuery, $options: "i" } },
      { lastName: { $regex: searchQuery, $options: "i" } },
      { placeName: { $regex: searchQuery, $options: "i" } },
      { "address.country": { $regex: searchQuery, $options: "i" } },
      { "address.state": { $regex: searchQuery, $options: "i" } },
      { "address.city": { $regex: searchQuery, $options: "i" } },
      { "address.street": { $regex: searchQuery, $options: "i" } },
      { "address.zip": { $regex: searchQuery, $options: "i" } },
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

    // Apply category filter
    if (filters.category) {
      filterQuery.category = filters.category;
    }

    // Find the category by name
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });

      if (category) {
        filterQuery.category = category._id;
      } else {
        // Return an empty response if category not found
        return res.status(200).json({
          status: "success",
          pagination: {
            total: 0,
            totalPages: 0,
            currentPage: page,
            perPage: limit,
          },
          data: [],
        });
      }
    }

    // Find the vendors based on tag search query
    if (tagSearchQuery) {
      const matchingTags = await Tags.find({ name: tagSearchQuery });

      // Extract the category IDs from the found tags
      const matchingCategoryIds = matchingTags.map((tag) => tag.category);

      if (matchingCategoryIds.length > 0) {
        filterQuery.category = { $in: matchingCategoryIds };
      } else {
        // Return an empty response if no matching tags found
        return res.status(200).json({
          status: "success",
          pagination: {
            total: 0,
            totalPages: 0,
            currentPage: page,
            perPage: limit,
          },
          data: [],
        });
      }
    }

    const [vendors, total] = await Promise.all([
      Vendors.find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortQuery)
        .populate("category"),
      Vendors.countDocuments(filterQuery),
    ]);

    const vendorData = await Promise.all(
      vendors.map(async (vendor) => {
        const vendorObj = vendor.toObject();
        const vendorCategory = await Category.findById(vendor.category);
        vendorObj.category = vendorCategory;

        // Find the tags attached to the category
        const categoryTags = await Tags.find({ category: vendor.category });
        const tagNames = categoryTags.map((tag) => tag.name);

        // Attach the tag names to the vendor object
        vendorObj.tagNames = tagNames;

        return vendorObj;
      })
    );

    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      status: "success",
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
      data: vendorData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAllVendors = AsyncHandler(getAllVendors);

//getSearchedVendors

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

  const tags = await Tags.find({ category: vendor.category[0]._id });
  vendor.tags = tags;

  res.status(200).json({
    status: "success",
    data: vendor,
    tags: tags,
  });
});

exports.updatingDatabaseImageValues = AsyncHandler(async (req, res, next) => {
  if (req.files && req.files.thumbnail) {
    req.body.thumbnail = `vendor-${uuidv4()}-${Date.now()}-cover.jpeg`;
  }

  if (req.files && req.files.gallery) {
    req.body.gallery = [];
    await Promise.all(
      req.files.gallery.map(async (img, index) => {
        req.body.gallery.push(
          `vendor-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
        );
      })
    );
  }

  next();
});

exports.addVendor = AsyncHandler(async (req, res, next) => {
  const address = {
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    zip: +req.body.zip,
    street: req.body.street || "st",
  };
  req.body.address = address;

  const vendorRole = await Roles.find({ name: "Vendor" });
  req.body.role = vendorRole._id;

  const saltRunds = 10;
  const salt = bcrypt.genSaltSync(saltRunds);
  const passwordBody = req.body.password || "";
  const password = bcrypt.hashSync(passwordBody, salt);
  req.body.password = password;

  const document = await Vendors.create(req.body);

  if (req.files && req.files.thumbnail) {
    await sharp(req.files.thumbnail[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, "../images/vendors/", req.body.thumbnail));
  }
  if (req.files && req.files.gallery) {
    await Promise.all(
      req.files.gallery.map(async (img, index) => {
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(
            path.join(__dirname, "../images/vendors/", req.body.gallery[index])
          );
      })
    );
  }

  const message = `A new request for Adding New Place Named ${document.placeName} For Mr ${document.firstName} ${document.lastName} `;
  socket.emit("changeInVendorTable");
  await new Notification({
    content: message,
    for: "admin/emp",
    placeId: document._id,
  }).save();

  greetingMessage(document);
  res.status(201).json({ data: document });
});

exports.updateVendor = AsyncHandler(async (req, res, next) => {
  const document = await Vendors.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        placeName: req.body.placeName,
        email: req.body.email,
        category: req.body.category,

        street: req.body.street,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,

        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        gallery: req.body.gallery,
      },
    }
  );
  // const document = await Vendors.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  // });
  if (!document) {
    return next(new ApiError("Document not found", 404));
  }
  console.log(document);

  if (document.thumbnail) {
    await fs.unlink(
      path.join(__dirname, "..", "images", "vendors", document.thumbnail),
      (error) => {
        if (error) throw new ApiError(error, 404);
      }
    );
  }
  if (document.gallery) {
    document.gallery.forEach(async (image) => {
      await fs.unlink(
        path.join(__dirname, "..", "images", "vendors", image),
        (error) => {
          if (error) throw new ApiError(error, 404);
        }
      );
    });
  }

  if (req.files && req.files.thumbnail) {
    await sharp(req.files.thumbnail[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, "../images/vendors/", req.body.thumbnail));
  }
  if (req.files && req.files.gallery) {
    await Promise.all(
      req.files.gallery.map(async (img, index) => {
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(
            path.join(__dirname, "../images/vendors/", req.body.gallery[index])
          );
      })
    );
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
  if (!document) {
    return next(new ApiError("No Vendor Found", 404));
  }
  req.body.email = document.email;
  req.body.modelType = "vendor";

  const notification = await Notification.updateOne(
    { placeId: req.params.id },
    {
      isApproved: true,
    }
  );
  if (!notification) {
    return next(new ApiError("No Notification Found", 404));
  }
  socket.emit("changeInVendorTable");
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

exports.processingImage = AsyncHandler(async (req, res, next) => {
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

exports.getLoggedVendorData = AsyncHandler(async (req, res, next) => {
  console.log(req.decodedToken.payload.id);
  req.params.id = req.decodedToken.payload.id;
  console.log(req.params.id);
  next();
});

exports.updateLoggedVendorPassword = AsyncHandler(async (req, res, next) => {
  //1) update user password based on the user payload (req.user._id)
  const user = await Vendors.findByIdAndUpdate(
    req.decodedToken.payload.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //2)generate token
  const token = createToken(user._id);
  res.status(200).json({
    data: user,
    token,
  });
});

exports.updateLoggedVendorData = AsyncHandler(async (req, res, next) => {
  const updatedUser = await Vendors.findByIdAndUpdate(
    req.decodedToken.payload.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

exports.deleteLoggedVendorData = AsyncHandler(async (req, res, next) => {
  await Vendors.findOneAndUpdate(req.decodedToken.payload.id, {
    active: false,
  });

  res.status(200).json({ status: "Your Account Deleted Successfully" });
});

exports.getTopRatedPlaces = AsyncHandler(async (req, res, next) => {
  try {
    // Code Here...
    const topRatedPlaces = await Vendors.find().sort({ avgRate: -1 }).limit(5);

    if (topRatedPlaces.length > 0) {
      res.status(200).json({ data: topRatedPlaces });
    } else {
      res.status(200).json({ data: "There are no top-rated places yet." });
    }
  } catch (error) {
    throw new ApiError("Error to get top rated places...!", 500);
  }
});
