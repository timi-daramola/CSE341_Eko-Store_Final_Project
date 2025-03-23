const express = require('express');
const app = express();
const { swaggerUi, specs } = require('./swaggerConfig');
const mongodb = require('./data/database');
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/products', require('./routes/products'));

// Initialize the database
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize database', err);
        process.exit(1);
    } else {
        console.log('Database initialized successfully');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }
});
