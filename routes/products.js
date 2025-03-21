const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/', productController.getAll);

router.get('/:id', productController.getSingle);

router.post('/', productController.createContact);

router.put('/:id', productController.updateContact);

router.delete('/:id', productController.deleteContact);

module.exports = router;