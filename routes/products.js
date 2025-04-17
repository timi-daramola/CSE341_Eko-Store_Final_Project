const express = require('express');
const productController = require('../controllers/productController');
const ensureAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();


router.delete('/:id', ensureAuthenticated, productController.deleteProduct);

module.exports = router;