const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/radiography_cms');
const versionCtrl = require('../controllers/version_control');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Hero routes
router.get('/hero', ctrl.hero.get);
router.put('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.upsert);
router.delete('/hero', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.softDelete);
router.post('/hero/restore', authCheck, authAllowTypes([userTypes.Admin]), ctrl.hero.restore);

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

