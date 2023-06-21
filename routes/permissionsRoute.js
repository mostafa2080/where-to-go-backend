const express = require('express');
const { EmployeeOrAbove } = require('../middlewares/authorizationMiddleware');

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
  .get(EmployeeOrAbove, getPermissions)
  .post(EmployeeOrAbove, validateCreatePermission, createPermission);

// Routes for '/api/v1/permissions/:id'
router
  .route('/:id')
  .get(EmployeeOrAbove, validateGetPermissionById, getPermissionById)
  .put(EmployeeOrAbove, validateUpdatePermission, updatePermission)
  .delete(EmployeeOrAbove, validateDeletePermission, deletePermission);

module.exports = router;
