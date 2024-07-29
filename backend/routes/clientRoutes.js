const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const { placeOrder } = require('../controllers/clientController');

router.post('/place-order', auth, placeOrder);

module.exports = router;
