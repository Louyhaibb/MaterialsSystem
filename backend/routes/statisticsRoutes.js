const express = require('express');
const router = express.Router();
const validateToken = require('../utils/validateToken');
const { getStatistics } = require('../controllers/statisticsController');

router.get('/', validateToken(['admin']), getStatistics);

module.exports = router;