const multer = require("multer");

exports.uploadImg = () =>
  multer({
    fileFilter: (req, file, callBack) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        callBack(null, true);
      } else {
        callBack(new Error("Add a valid Image"));
      }
    },
    limits: { fileSize: 1024 * 1024 }, // 1 MB
    storage: multer.memoryStorage(),
  });
