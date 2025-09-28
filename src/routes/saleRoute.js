const express = require('express');
const { checkToken } = require('../middleware/authMiddleware');
const { getProductSalesCatalog, postSale, getSalesHistor, getSakeHistoryDetail } = require('../controllers/saleC');

const router = express.Router()

router.get('/', checkToken, getProductSalesCatalog)
router.get('/history', checkToken, getSalesHistor)
router.get('/history/:id', checkToken, getSakeHistoryDetail)
router.post('/', checkToken, postSale)

module.exports = router