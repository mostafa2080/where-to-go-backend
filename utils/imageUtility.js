const multer = require("multer");
const path = require("path");

exports.uploadImg = (Routepath) => {
  return multer({
    fileFilter: (req, file, callBack) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        callBack(null, true);
      } else {
        callBack(new Error("Add a valid Image"));
      }
    },
    limits: { fileSize: 1024 * 1024 }, // 1 MB
    storage: multer.diskStorage({
      destination: (req, file, callBack) => {
        callBack(null, path.join(__dirname, "..", "images", Routepath));
      },
      filename: (req, file, callBack) => {
        let extension = path.extname(file.originalname);
        let fileName = path.basename(file.originalname, extension);
        let unqImgName =
          file.fieldname + "-" + fileName + "-" + Date.now() + extension;
        callBack(null, unqImgName);
      },
    }),
  });
};

exports.setImage = (req, res, next) => {
  if (req.file && req.file.path) req.body.image = req.file.path;
  next();
};
