const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
const getAll = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const products = await db.collection('products').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
const getSingle = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const productId = new ObjectId(req.params.id);
        const product = await db.collection('products').findOne({ _id: productId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: An error occurred while creating the product
 */
const createProduct = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const product = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
            createdAt: req.body.createdAt,
        };
        const response = await db.collection('products').insertOne(product);
        res.status(201).json(response);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       204:
 *         description: Product updated successfully
 *       500:
 *         description: An error occurred while updating the product
 */
const updateProduct = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const productId = new ObjectId(req.params.id);
        const updatedProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
            createdAt: req.body.createdAt,
        };
        const response = await db.collection('products').replaceOne({ _id: productId }, updatedProduct);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while updating the product' });
        }
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       500:
 *         description: An error occurred while deleting the product
 */
const deleteProduct = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const productId = new ObjectId(req.params.id);
        const response = await db.collection('products').deleteOne({ _id: productId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while deleting the product' });
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
    deleteProduct,
};