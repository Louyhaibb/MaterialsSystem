const express = require('express');
const { leaveReview } = require('../controllers/reviewController');
const validateToken = require('../utils/validateToken');
const router = express.Router();

router.post('/leave-review', validateToken(['client']), leaveReview);

module.exports = router;
