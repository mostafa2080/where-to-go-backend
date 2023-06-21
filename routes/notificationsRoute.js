const express = require("express");

const router = express.Router();

const notificationsController = require("../controllers/notificationController");

router.route("/").get(notificationsController.getAllNotifications);

module.exports = router;
