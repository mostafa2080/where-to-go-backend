const express = require('express');
const { authorize } = require('../middlewares/authorizationMiddleware');

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
  .get(authorize(['get_roles']), getRoles)
  .post(authorize(['create_role']), validateCreateRole, createRole);

// Routes for '/api/v1/roles/:id'
router
  .route('/:id')
  .get(authorize(['get_role']), validateGetRoleById, getRoleById)
  .put(authorize(['edit_role']), validateUpdateRole, updateRole)
  .delete(authorize(['delete_role']), validateDeleteRole, deleteRole);

module.exports = router;
