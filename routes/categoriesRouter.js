const express = require("express");

const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  validateCreateCategory,
  validateDeleteCategory,
  validateUpdateCategory,
  validateGetCategoryById,
} = require("../utils/validators/categoriesValidator");

// Routes for '/api/v1/categories'
router
  .route("/")
  .get(getCategories)
  .post(validateCreateCategory, createCategory);

// Routes for '/api/v1/categories/:id'
router
  .route("/:id")
  .get(validateGetCategoryById, getCategoryById)
  .put(validateUpdateCategory, updateCategory)
  .delete(validateDeleteCategory, deleteCategory);

module.exports = router;
