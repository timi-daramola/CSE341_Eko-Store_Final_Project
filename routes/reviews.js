const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Route to add a review
router.post('/', reviewController.addReview);

// Route to get reviews for a product by name
router.get('/:name', reviewController.getReviewsByProductName);

module.exports = router;