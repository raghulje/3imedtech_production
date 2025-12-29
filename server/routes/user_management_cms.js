const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/user_management_cms');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const { createUserSchema } = require('../middlewares/userValidator');
const userTypes = require('../utils/userTypes');

// Public routes (none for user management - all require admin)

// Protected routes (require admin authentication)
router.get('/', authCheck, authAllowTypes([userTypes.Admin]), userManagementController.list);
router.get('/:id', authCheck, authAllowTypes([userTypes.Admin]), userManagementController.get);
router.post('/', authCheck, authAllowTypes([userTypes.Admin]), createUserSchema, userManagementController.create);
router.put('/:id', authCheck, authAllowTypes([userTypes.Admin]), userManagementController.update);
router.delete('/:id', authCheck, authAllowTypes([userTypes.Admin]), userManagementController.delete);
router.patch('/:id/toggle-active', authCheck, authAllowTypes([userTypes.Admin]), userManagementController.toggleActive);

module.exports = router;

