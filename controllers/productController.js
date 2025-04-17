const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const Product = require('../models/productModel');

// Helper function to get the database collection
const getProductCollection = () => {
    const db = mongodb.getDatabase();
    return db.collection('products');
};

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        // Validate required fields
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new product
        const newProduct = new Product({ name, description, price, stock, category });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

// Get all products
const getAll = async (req, res) => {
    try {
        const products = await getProductCollection().find().toArray();
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

// Get a single product by ID
const getSingle = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const product = await getProductCollection().findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const updatedProduct = req.body;

        // Validate required fields
        if (!updatedProduct.name || !updatedProduct.description || !updatedProduct.price || !updatedProduct.stock || !updatedProduct.category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const response = await getProductCollection().replaceOne({ _id: productId }, updatedProduct);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Product not found or no changes made' });
        }
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const response = await getProductCollection().deleteOne({ _id: productId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};

module.exports = {
    addProduct,
    getAll,
    getSingle,
    updateProduct,
    deleteProduct,
};