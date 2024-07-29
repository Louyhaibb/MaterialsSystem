const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const { getOrdersForCompany, updateOrderStatus, getStats } = require('../controllers/orderController');

router.get('/orders', auth, getOrdersForCompany);
router.put('/update-status', auth, updateOrderStatus);
router.get('/stats', auth, getStats);

module.exports = router;
