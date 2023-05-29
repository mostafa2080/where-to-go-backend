const express = require('express');

const router = express.Router();
const {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} = require('../controllers/permissionsController');

// Routes for '/api/v1/permissions'
router.route('/').get(getPermissions).post(createPermission);

// Routes for '/api/v1/permissions/:id'
router
  .route('/:id')
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);

module.exports = router;
