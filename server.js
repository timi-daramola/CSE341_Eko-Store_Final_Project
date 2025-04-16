const express = require('express');
const session = require('express-session');
const passport = require('./passport'); // Import the Passport configuration
const userController = require('./controllers/userController'); // Import user controller
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { swaggerUi, specs } = require('./swaggerConfig');
const mongodb = require('./data/database');

const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
        secret: '850b7afa18111722fa47c61729658ff3b4751198',
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/products', require('./routes/products'));
app.use('/customers', require('./routes/customers'));
app.use('/reviews', require('./routes/reviews'));

// GitHub OAuth Routes
app.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }) // Redirect to GitHub for authentication
);

app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }), // Handle callback from GitHub
    (req, res) => {
        // Successful authentication
        res.redirect('/profile'); // Redirect to the profile page
        res.redirect('/username'); // Redirect to the profile page
    }
);

// User Profile Route
app.get('/profile', userController.getProfile);
app.get('/username', userController.getUsername);

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect('/'); // Redirect to the home page after logout
        });
    });
});

// Initialize the database
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize database', err);
        process.exit(1);
    } else {
        console.log('Database initialized successfully');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});
