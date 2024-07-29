const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const adminAuth = require('../middleware/adminAuth');
const { getAllCompanies, getAllClients, deleteUser } = require('../controllers/adminController');

// Get all companies
router.get('/companies', [auth, adminAuth], getAllCompanies);

// Get all clients
router.get('/clients', [auth, adminAuth], getAllClients);

// Delete user by id
router.delete('/user/:id', [auth, adminAuth], deleteUser);

module.exports = router;
