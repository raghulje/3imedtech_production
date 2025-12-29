const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/fpd_carm_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero routes
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Content routes
router.get('/content', ctrl.content.get);
router.put('/content', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.upsert);
router.delete('/content', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.softDelete);
router.post('/content/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.restore);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

