const express = require('express');
const { addPurchaseWithDetails, getAllPurchase, getPurchaseWithDetails } = require('../controllers/purchaseC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getAllPurchase)
router.post('/', checkToken, addPurchaseWithDetails)
router.get('/:purchase_id', checkToken, getPurchaseWithDetails)

module.exports = router