const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const { register, addTransferService } = require('../controllers/companyController');

router.post('/register', register);
router.post('/add-service', auth, addTransferService);

module.exports = router;
