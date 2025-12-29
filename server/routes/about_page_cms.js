const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/about_page_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Redefining Healthcare Section
router.get('/redefining-healthcare', ctrl.redefiningHealthcare.get);
router.put('/redefining-healthcare', authCheck, authAllowTypes([userTypes.Admin]), ctrl.redefiningHealthcare.upsert);
router.delete('/redefining-healthcare', authCheck, authAllowTypes([userTypes.Admin]), ctrl.redefiningHealthcare.softDelete);
router.post('/redefining-healthcare/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.redefiningHealthcare.restore);

// Explore Refex Group Section
router.get('/refex-group', ctrl.refexGroup.get);
router.put('/refex-group', authCheck, authAllowTypes([userTypes.Admin]), ctrl.refexGroup.upsert);
router.delete('/refex-group', authCheck, authAllowTypes([userTypes.Admin]), ctrl.refexGroup.softDelete);
router.post('/refex-group/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.refexGroup.restore);

// Content Sections
router.get('/content', ctrl.content.list);
router.get('/content/:type', ctrl.content.getByType);
router.put('/content/:type', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.upsert);
router.delete('/content/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.remove);
router.post('/content/:id/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.content.restore);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

