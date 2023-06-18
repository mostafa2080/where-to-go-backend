const mongoose = require("mongoose");
const AsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
require("../models/Notification");

const Notification = mongoose.model("notification");

exports.getAllNotifications = AsyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({});
  if (notifications === []) return new ApiError("No Notification Found", 400);
  res.status(200).json({
    status: "success",
    data: notifications,
  });
});
