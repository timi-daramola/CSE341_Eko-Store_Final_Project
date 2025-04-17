const mongodb = require('../data/database');
const mongoose = require('mongoose');

const getReviewCollection = () => {
    const db = mongodb.getDatabase();
    return db.collection('reviews');
};

// Add a review for a product
const addReview = async (review) => {
    const collection = getReviewCollection();
    review.name = review.name.toLowerCase(); // Normalize the name to lowercase
    const result = await collection.insertOne(review);
    return { ...review, _id: result.insertedId };
};

// Retrieve reviews for a specific product by name
const getReviewsByProductName = async (name) => {
    const collection = getReviewCollection();
    return await collection.find({ name: name.toLowerCase() }).toArray();
};

// Retrieve all reviews
const getAllReviews = async () => {
    const collection = getReviewCollection();
    return await collection.find().toArray();
};

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);

module.exports = {
    addReview,
    getReviewsByProductName,
    getAllReviews, // Export the new function
};