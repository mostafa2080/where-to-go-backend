const { body, param } = require("express-validator");

exports.getValidationArray = [
  param("id").isMongoId().withMessage("Id Needs To Be MongoId"),
];

exports.addValidationArray = [
  body("firstName").isString().withMessage("First Name is Required"),
  body("lastName").isString().withMessage("Last Name is Required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid Email & Not duplicated"),
  body("phoneNumber").isString().withMessage("Enter A Valid Phone Number"),
  body("description").isString().withMessage("Description Is Needed"),
  // body("thumbnail").isString().withMessage("Image must be a String"),
  // body("gallery").isString().withMessage("Please Upload Gallery Images"),
  body("category").isMongoId().withMessage("Category is mongoID"),
];

exports.updateValidationArray = [
  body("firstName").optional().isString().withMessage("First Name is Required"),
  body("lastName").optional().isString().withMessage("Last Name is Required"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid Email & Not duplicated"),
  body("phoneNumber")
    .optional()
    .isString()
    .withMessage("Enter A Valid Phone Number"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description Is Needed"),
  body("thumbnail").optional().isString().withMessage("Image must be a String"),
  body("gallery")
    .optional()
    .isArray()
    .withMessage("Please Upload Gallery Images"),
];

exports.deleteValidationArray = [
  param("id").isMongoId().withMessage("Id Needs To Be MongoId"),
];
