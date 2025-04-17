const express = require('express');
const productController = require('../controllers/productController');
const ensureAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productController.getAll);

router.get('/:id', productController.getSingle);

// Route to create a new product (restricted to authenticated users)
router.post('/', ensureAuthenticated, productController.addProduct);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;