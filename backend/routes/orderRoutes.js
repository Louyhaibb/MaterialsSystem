const express = require('express');
const router = express.Router();
const { getCompanyDetails, orderRequest, getClientOrders, getCompanyOrders, getOneOrder, updateOrderStatus } = require('../controllers/orderController');
const validateToken = require('../utils/validateToken');

router.get('/company-detail/:companyId', validateToken(['admin', 'client', 'company']), getCompanyDetails);
router.post('/order-request', validateToken(['client']), orderRequest);
router.get('/client-orders', validateToken(['client']), getClientOrders);
router.get('/company-orders', validateToken(['company']), getCompanyOrders);
router.get('/getOneOrder/:id', validateToken(['company', 'client']), getOneOrder);
router.put('/update-status', validateToken(['company', 'client']), updateOrderStatus);

module.exports = router;
