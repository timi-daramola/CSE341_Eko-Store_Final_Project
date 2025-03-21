const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //swagger.tags = ['products'];
    try {
        const db = mongodb.getDatabase();
        console.log('Using database:', db.databaseName);
        const result = await db.collection('products').find().toArray();
        console.log('Fetched products:', result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

const getSingle = async (req, res) => {
    //swagger.tags = ['products'];
    try {
        const productId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        console.log('Using database:', db.databaseName);
        const result = await db.collection('products').findOne({ _id: productId });
        console.log('Fetched product:', result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
};

const createProduct = async (req, res) => {
    //swagger.tags = ['products'];
    try {
        const product = new mongoose.Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true },
            category: { type: String, required: true },
            imageUrl: { type: String },
            createdAt: { type: Date, default: Date.now },
        });
        
        const db = mongodb.getDatabase();
        const response = await db.collection('products').insertOne(product);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while creating the product' });
        }
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
};

const updateProduct = async (req, res) => {
    //swagger.tags = ['products'];
    try {
        const productId = new ObjectId(req.params.id);
        const product = new mongoose.Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true },
            category: { type: String, required: true },
            imageUrl: { type: String },
            createdAt: { type: Date, default: Date.now },
        });
        const db = mongodb.getDatabase();
        const response = await db.collection('products').replaceOne({ _id: productId }, product);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while updating the product' });
        }
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};

const deleteProduct = async (req, res) => {
    //swagger.tags = ['products'];
    try {
        const productId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('products').deleteOne({ _id: productId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while deleting the product' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    updateProduct,
    deleteProduct
};