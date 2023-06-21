const express = require('express');
const { EmployeeOrAbove } = require('../middlewares/authorizationMiddleware');

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
router
  .route('/')
  .get(EmployeeOrAbove, getRoles)
  .post(EmployeeOrAbove, validateCreateRole, createRole);

// Routes for '/api/v1/roles/:id'
router
  .route('/:id')
  .get(EmployeeOrAbove, validateGetRoleById, getRoleById)
  .put(EmployeeOrAbove, validateUpdateRole, updateRole)
  .delete(EmployeeOrAbove, validateDeleteRole, deleteRole);

module.exports = router;
