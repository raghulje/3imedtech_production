const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/home_page_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero
router.get('/hero', ctrl.hero.get);
router.put('/hero', 
  authCheck, 
  (req, res, next) => {
    console.log('🔍 [AUTH CHECK] Hero PUT - userData:', req.userData);
    next();
  },
  authAllowTypes([userTypes.Admin]),
  (req, res, next) => {
    console.log('✅ [AUTH ALLOW TYPES] Hero PUT - passed authentication, calling controller');
    next();
  },
  (req, res, next) => {
    console.log('🎯 [CONTROLLER] Hero PUT - About to call upsert');
    next();
  },
  ctrl.hero.upsert
);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// About Section
router.get('/about-section', ctrl.aboutSection.get);
router.put('/about-section', authCheck, authAllowTypes([userTypes.Admin]), ctrl.aboutSection.upsert);
router.delete('/about-section', authCheck, authAllowTypes([userTypes.Admin]), ctrl.aboutSection.softDelete);
router.post('/about-section/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.aboutSection.restore);

// Image Boxes
router.get('/image-boxes', ctrl.imageBoxes.list);
router.post('/image-boxes', authCheck, authAllowTypes([userTypes.Admin]), ctrl.imageBoxes.create);
router.put('/image-boxes/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.imageBoxes.update);
router.delete('/image-boxes/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.imageBoxes.remove);
router.post('/image-boxes/:id/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.imageBoxes.restore);
router.delete('/image-boxes/:id/permanent', authCheck, authAllowTypes([userTypes.Admin]), ctrl.imageBoxes.permanentDelete);

// Commitment
router.get('/commitment', ctrl.commitment.get);
router.put('/commitment', authCheck, authAllowTypes([userTypes.Admin]), ctrl.commitment.upsert);
router.delete('/commitment', authCheck, authAllowTypes([userTypes.Admin]), ctrl.commitment.softDelete);
router.post('/commitment/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.commitment.restore);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

