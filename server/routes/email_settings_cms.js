const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/email_settings_cms');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Email Settings routes (Admin only)
router.get('/', authCheck, authAllowTypes([userTypes.Admin]), ctrl.emailSettings.get);
router.put('/', authCheck, authAllowTypes([userTypes.Admin]), ctrl.emailSettings.upsert);
router.post('/test', authCheck, authAllowTypes([userTypes.Admin]), ctrl.emailSettings.test);

module.exports = router;

