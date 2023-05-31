const multer = require("multer");

/**
 * Original uploadImg function
 */

// exports.uploadImg = (Routepath) => multer({
//   fileFilter: (req, file, callBack) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg"
//     ) {
//       callBack(null, true);
//     } else {
//       callBack(new Error("Add a valid Image"));
//     }
//   },
//   limits: { fileSize: 1024 * 1024 }, // 1 MB
//   storage: multer.diskStorage({
//     destination: (req, file, callBack) => {
//       req.body.image = path.join(__dirname, "..", "images", Routepath);
//       callBack(null, req.body.image);
//     },
//     filename: (req, file, callBack) => {
//       const extension = path.extname(file.originalname);
//       const unqImgName = Date.now() + extension;
//       req.body.image = path.join(req.body.image, unqImgName);
//       console.log(req.body.image);
//       callBack(null, unqImgName);
//     },
//   }),
// });

exports.uploadImg = () => multer({
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

// exports.setImage = (req, res, next) => {
//   if (req.file && req.file.path) req.body.image = req.file.path;
//   console.log(req.body.image);
//   next();
// };
