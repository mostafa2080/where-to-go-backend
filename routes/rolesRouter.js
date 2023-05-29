const express = require('express');

const router = express.Router();

const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/rolesController');

// Routes
router.route('/').get(getRoles).post(createRole);
router.route('/:id').get(getRoleById).put(updateRole).delete(deleteRole);

module.exports = router;
