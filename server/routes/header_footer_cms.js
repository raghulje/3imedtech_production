const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/header_footer_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Settings
router.get('/:type', ctrl.settings.get); // 'header' or 'footer'
router.put('/:type', authCheck, authAllowTypes([userTypes.Admin]), ctrl.settings.upsert);
router.delete('/:type', authCheck, authAllowTypes([userTypes.Admin]), ctrl.settings.softDelete);
router.post('/:type/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.settings.restore);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

