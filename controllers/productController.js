const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //swagger.tags = ['contacts'];
    try {
        const db = mongodb.getDatabase();
        console.log('Using database:', db.databaseName);
        const result = await db.collection('contacts').find().toArray();
        console.log('Fetched contacts:', result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'An error occurred while fetching contacts' });
    }
};

const getSingle = async (req, res) => {
    //swagger.tags = ['contacts'];
    try {
        const contactId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        console.log('Using database:', db.databaseName);
        const result = await db.collection('contacts').findOne({ _id: contactId });
        console.log('Fetched contact:', result);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching contact:', err);
        res.status(500).json({ error: 'An error occurred while fetching the contact' });
    }
};

const createContact = async (req, res) => {
    //swagger.tags = ['contacts'];
    try {
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').insertOne(contact);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while creating the contact' });
        }
    } catch (err) {
        console.error('Error creating contact:', err);
        res.status(500).json({ error: 'An error occurred while creating the contact' });
    }
};

const updateContact = async (req, res) => {
    //swagger.tags = ['contacts'];
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').replaceOne({ _id: contactId }, contact);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while updating the contact' });
        }
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'An error occurred while updating the contact' });
    }
};

const deleteContact = async (req, res) => {
    //swagger.tags = ['contacts'];
    try {
        const contactId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('contacts').deleteOne({ _id: contactId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || { error: 'An error occurred while deleting the contact' });
        }
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'An error occurred while deleting the contact' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};