const asyncHandler = require('express-async-handler');
const Role = require('../models/Role');
const ApiError = require('../utils/apiError');

// @desc      Get all roles
// @route     GET /roles
// @access    Public
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

// @desc      Get role by ID
// @route     GET /roles/:id
// @access    Public
const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  res.json(role);
});

// @desc      Create a new role
// @route     POST /roles
// @access    Public
const createRole = asyncHandler(async (req, res) => {
  const role = await Role.create(req.body);
  res.status(201).json(role);
});

// @desc      Update role by ID
// @route     PUT /roles/:id
// @access    Public
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  res.json(role);
});

// @desc      Delete role by ID
// @route     DELETE /roles/:id
// @access    Public
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);

  if (!role) {
    throw new ApiError('Role not found', 404);
  }

  res.json({ message: 'Role deleted' });
});

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
