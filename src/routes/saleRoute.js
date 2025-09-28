const express = require('express');
const { checkToken } = require('../middleware/authMiddleware');
const { getProductSalesCatalog, postSale, getSalesHistor } = require('../controllers/saleC');

const router = express.Router()

router.get('/', checkToken, getProductSalesCatalog)
router.get('/history', checkToken, getSalesHistor)
router.post('/', checkToken, postSale)

module.exports = router