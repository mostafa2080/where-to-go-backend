const express = require('express');

const router = express.Router();
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/rolesController');
const {
  validateCreateRole,
  validateDeleteRole,
  validateUpdateRole,
  validateGetRoleById,
} = require('../utils/validators/rolesValidator');

// Routes for '/api/v1/roles'
router.route('/').get(getRoles).post(validateCreateRole, createRole);

// Routes for '/api/v1/roles/:id'
router
  .route('/:id')
  .get(validateGetRoleById, getRoleById)
  .put(validateUpdateRole, updateRole)
  .delete(validateDeleteRole, deleteRole);

module.exports = router;
