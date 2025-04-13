const mongodb = require('../data/database');

const getReviewCollection = () => {
    const db = mongodb.getDatabase();
    return db.collection('reviews');
};

// Add a review for a product
const addReview = async (review) => {
    const collection = getReviewCollection();
    const result = await collection.insertOne(review);
    return { ...review, _id: result.insertedId }; // Return the newly created review with its ID
};

// Retrieve reviews for a specific product by name
const getReviewsByProductName = async (name) => {
    const collection = getReviewCollection();
    return await collection.find({ name }).toArray();
};

module.exports = {
    addReview,
    getReviewsByProductName,
};