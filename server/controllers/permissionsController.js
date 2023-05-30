const asyncHandler = require('express-async-handler');

const Permission = require('../models/Permission');
const ApiError = require('../utils/apiError');

// @desc    Get all permissions
// @route   GET /api/v1/permissions
// @access  Public
exports.getPermissions = asyncHandler(async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
});

// @desc    Get single permission
// @route   GET /api/v1/permissions/:id
// @access  Public
exports.getPermissionById = asyncHandler(async (req, res) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    throw new ApiError('Permission not found', 404);
  }
  res.json(permission);
});

// @desc    Create permission
// @route   POST /api/v1/permissions
// @access  Public
exports.createPermission = asyncHandler(async (req, res) => {
  const permission = await Permission.create(req.body);
  res.status(201).json(permission);
});

// @desc    Update permission
// @route   PUT /api/v1/permissions/:id
// @access  Public
exports.updatePermission = asyncHandler(async (req, res) => {
  const permission = await Permission.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!permission) {
    throw new ApiError('Permission not found', 404);
  }
  res.json(permission);
});

// @desc    Delete permission
// @route   DELETE /api/v1/permissions/:id
// @access  Public
exports.deletePermission = asyncHandler(async (req, res) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) {
    throw new ApiError('Permission not found', 404);
  }
  res.json({ message: 'Permission deleted successfully' });
});
