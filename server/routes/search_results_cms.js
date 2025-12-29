const express = require('express');
const router = express.Router();
const searchResultsController = require('../controllers/search_results_cms');
const { authCheck, authAllowTypes } = require('../middlewares/auth');
const userTypes = require('../utils/userTypes');

// Public routes
router.get('/', searchResultsController.getAll);
router.get('/page/:page', searchResultsController.getByPage);

// Protected routes (require admin authentication)
router.post('/', authCheck, authAllowTypes([userTypes.Admin]), searchResultsController.create);
router.put('/:id', authCheck, authAllowTypes([userTypes.Admin]), searchResultsController.update);
router.delete('/:id', authCheck, authAllowTypes([userTypes.Admin]), searchResultsController.delete);

module.exports = router;

