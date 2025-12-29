const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/portable_xray_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero routes
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

// Overview routes
router.get('/overview', ctrl.overview.get);
router.put('/overview', authCheck, authAllowTypes([userTypes.Admin]), ctrl.overview.upsert);

// Features routes
router.get('/features', ctrl.features.list);
router.post('/features', authCheck, authAllowTypes([userTypes.Admin]), ctrl.features.create);
router.put('/features/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.features.update);
router.delete('/features/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.features.delete);

// Specifications routes
router.get('/specifications', ctrl.specifications.list);
router.post('/specifications', authCheck, authAllowTypes([userTypes.Admin]), ctrl.specifications.create);
router.put('/specifications/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.specifications.update);
router.delete('/specifications/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.specifications.delete);

// Products routes
router.get('/products', ctrl.products.list);
router.post('/products', authCheck, authAllowTypes([userTypes.Admin]), ctrl.products.create);
router.put('/products/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.products.update);
router.delete('/products/:id', authCheck, authAllowTypes([userTypes.Admin]), ctrl.products.delete);
router.post('/products/:id/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.products.restore);
router.delete('/products/:id/permanent', authCheck, authAllowTypes([userTypes.Admin]), ctrl.products.permanentDelete);

// Version Control
router.get('/versions', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersions);
router.get('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.getVersion);
router.delete('/versions/:id', authCheck, authAllowTypes([userTypes.Admin]), versionCtrl.deleteVersion);

module.exports = router;

