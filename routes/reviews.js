const express = require('express');
const reviewController = require('../controllers/reviewController');
const ensureAuthenticated = require('../middleware/authMiddleware');
const { getAllReviews } = require('../models/reviewModel');

const router = express.Router();

// Route to add a review (restricted to authenticated users)
router.post('/', ensureAuthenticated, reviewController.addReview);

// Route to get reviews for a product (restricted to authenticated users)
router.get('/:name', ensureAuthenticated, reviewController.getReviewsByProductName);

// GET ALL reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

module.exports = router;