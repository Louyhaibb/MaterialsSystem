const express = require('express');
const router = express.Router();
const validateToken = require('../utils/validateToken');
const { getAdditionalServices, createAdditionalService, updateAdditionalService, deleteAdditionalService, getOneAdditionalService } = require('../controllers/additionalServiceController');

router.get('/', validateToken(['company', 'client']), getAdditionalServices);
router.post('/create', validateToken(['company']), createAdditionalService);
router.put('/update/:id', validateToken(['company']), updateAdditionalService);
router.delete('/delete/:id', validateToken(['company']), deleteAdditionalService);
router.get('/getOneService/:id', validateToken(['company']), getOneAdditionalService);

module.exports = router;
