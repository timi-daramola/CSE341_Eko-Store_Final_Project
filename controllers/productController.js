const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const Product = require('../models/productModel');


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         stock:
 *           type: number
 *           description: The stock quantity of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the product was created
 *       example:
 *         name: Sample Product
 *         description: This is a sample product.
 *         price: 99.99
 *         stock: 10
 *         category: Electronics
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
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
 *         description: The product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getSingle);

/**
 * @swagger
 * /api/products:
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
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.post('/', ensureAuthenticated, productController.addProduct);

/**
 * @swagger
 * /api/products/{id}:
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
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */
router.put('/:id', ensureAuthenticated, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
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
 *       404:
 *         description: Product not found
 */
router.delete('/:id', ensureAuthenticated, productController.deleteProduct);

// Get all products
const getAll = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products.', error });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newProduct = new Product({ name, description, price, stock, category });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product.', error });
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
    getAll,
    addProduct,
    getSingle,
    updateProduct,
    deleteProduct,
};