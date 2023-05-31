const express = require('express');

const router = express.Router();
const {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permissionsController');
const {
  validateCreatePermission,
  validateDeletePermission,
  validateUpdatePermission,
  validateGetPermissionById,
} = require('../utils/validators/PermissionsValidator');

// Routes for '/api/v1/permissions'
router
  .route('/')
  .get(getPermissions)
  .post(validateCreatePermission, createPermission);

// Routes for '/api/v1/permissions/:id'
router
  .route('/:id')
  .get(validateGetPermissionById, getPermissionById)
  .put(validateUpdatePermission, updatePermission)
  .delete(validateDeletePermission, deletePermission);

module.exports = router;
