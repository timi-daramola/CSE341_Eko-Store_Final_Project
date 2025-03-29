const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');


const getAllCustomers = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customers = await db.collection('customers').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: 'An error occurred while fetching customers' });
    }
};


const getSingleCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const customer = await db.collection('customers').findOne({ _id: customerId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customer);
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ error: 'An error occurred while fetching the customer' });
    }
};


const createCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Address: req.body.Address,
            Email: req.body.Email,
            phoneNumber: req.body.phoneNumber,
            createdAt: req.body.createdAt,
        };
        const response = await db.collection('customers').insertOne(customer);
        res.status(201).json(response);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ error: 'An error occurred while creating the customer' });
    }
};


const updateCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const updatedcustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Address: req.body.Address,
            Email: req.body.Email,
            phoneNumber: req.body.phoneNumber,
            createdAt: req.body.createdAt,
        };
        const response = await db.collection('customers').replaceOne({ _id: customerId }, updatedcustomer);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while updating the customer' });
        }
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'An error occurred while updating the customer' });
    }
};


const deleteCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const response = await db.collection('customers').deleteOne({ _id: customerId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while deleting the customer' });
        }
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'An error occurred while deleting the customer' });
    }
};

module.exports = {
    getAllCustomers,
    getSingleCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};