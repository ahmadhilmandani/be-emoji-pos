const express = require('express');
const { addPurchaseWithDetails } = require('../controllers/purchaseC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/', checkToken, addPurchaseWithDetails)

module.exports = router