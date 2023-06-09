const express = require('express');

const router = express.Router();
const {
    getTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
} = require('../controllers/tagController');

const {
  validateCreateTag,
  validateDeleteTag,
  validateUpdateTag,
  validateGetTagById,
} = require('../utils/validators/tagsValidator');

// Routes for '/api/v1/tags'
router.route('/').get(getTags).post(
    validateCreateTag,
    createTag
);

// Routes for '/api/v1/tags/:id'
router
    .route('/:id')
    .get(
        validateGetTagById,
        getTagById
    )
    .put(validateUpdateTag, updateTag)
    .delete(validateDeleteTag, deleteTag);

module.exports = router;
