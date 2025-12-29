const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mission_vision_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Content Sections (Mission/Vision)
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

