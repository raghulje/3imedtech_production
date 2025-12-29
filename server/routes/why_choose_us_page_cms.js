const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/why_choose_us_page_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Offerings
router.get('/offerings', ctrl.offerings.get);
router.put('/offerings', authCheck, authAllowTypes([userTypes.Admin]), ctrl.offerings.upsert);
router.delete('/offerings', authCheck, authAllowTypes([userTypes.Admin]), ctrl.offerings.softDelete);
router.post('/offerings/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.offerings.restore);

// Advantages
router.get('/advantages', ctrl.advantages.get);
router.put('/advantages', authCheck, authAllowTypes([userTypes.Admin]), ctrl.advantages.upsert);
router.delete('/advantages', authCheck, authAllowTypes([userTypes.Admin]), ctrl.advantages.softDelete);
router.post('/advantages/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.advantages.restore);

// Get all sections
router.get('/all', ctrl.getAll);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

