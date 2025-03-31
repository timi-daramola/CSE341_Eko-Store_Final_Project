const userModel = require('../models/userModel');

const getProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user); // Return the authenticated user's profile
};

module.exports = {
    getProfile,
};