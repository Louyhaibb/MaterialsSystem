const express = require('express');
const { leaveReview, getReviews } = require('../controllers/reviewController');
const validateToken = require('../utils/validateToken');
const router = express.Router();

router.get('/getReview/:company', validateToken(['admin', 'client', 'company']), getReviews);
router.post('/leave-review', validateToken(['client']), leaveReview);

module.exports = router;
