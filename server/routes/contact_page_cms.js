const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contact_page_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Info Cards
router.get('/info-cards', ctrl.infoCards.list);
router.get('/info-cards/:id', ctrl.infoCards.get);
router.post('/info-cards', authCheck, authAllowTypes([userTypes.Admin]), ctrl.infoCards.create);
router.put('/info-cards/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.infoCards.update);
router.delete('/info-cards/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.infoCards.delete);
router.post('/info-cards/:id/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.infoCards.restore);

// Map
router.get('/map', ctrl.map.get);
router.put('/map', authCheck, authAllowTypes([userTypes.Admin]), ctrl.map.upsert);
router.delete('/map', authCheck, authAllowTypes([userTypes.Admin]), ctrl.map.softDelete);
router.post('/map/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.map.restore);

// Form
router.get('/form', ctrl.form.get);
router.put('/form', authCheck, authAllowTypes([userTypes.Admin]), ctrl.form.upsert);
router.delete('/form', authCheck, authAllowTypes([userTypes.Admin]), ctrl.form.softDelete);
router.post('/form/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.form.restore);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

