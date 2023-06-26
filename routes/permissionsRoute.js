const express = require('express');
const { authorize } = require('../middlewares/authorizationMiddleware');

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
  .get(authorize(['get_permissions']), getPermissions)
  .post(authorize(['create_permission']), validateCreatePermission, createPermission);

// Routes for '/api/v1/permissions/:id'
router
  .route('/:id')
  .get(authorize(['get_permission']), validateGetPermissionById, getPermissionById)
  .put(authorize(['edit_permission']), validateUpdatePermission, updatePermission)
  .delete(authorize(['delete_permission']), validateDeletePermission, deletePermission);

module.exports = router;
