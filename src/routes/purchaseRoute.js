const express = require('express');
const { addPurchaseWithDetails, getAllPurchase } = require('../controllers/purchaseC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getAllPurchase)
router.post('/', checkToken, addPurchaseWithDetails)

module.exports = router