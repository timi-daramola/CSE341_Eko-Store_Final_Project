const dotenv = require("dotenv");
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI || "mongodb+srv://timilehin:timi12345@cluster0.zpbf3.mongodb.net/ecommerce";
let database;

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((client) => {
            console.log('Connected to MongoDB');
            database = client.db(); // Correctly assign the database instance
            console.log('Database instance assigned');
            callback(null, database);
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};

// Example usage
initDb((err, db) => {
    if (err) {
        console.error('Failed to initialize database', err);
    } else {
        console.log('Database initialized successfully');
        const database = getDatabase();
        // You can now use the database instance
        console.log('Database instance is ready to use');

        // Example of using the database instance
        const collection = database.collection('products');
        collection.find({}).toArray((err, docs) => {
            if (err) {
                console.error('Failed to fetch documents', err);
            } else {
                console.log('Documents fetched successfully', docs);
            }
        });
    }
});