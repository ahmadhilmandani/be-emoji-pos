const express = require('express');
const { checkToken } = require('../middleware/authMiddleware');
const { getProductSalesCatalog, postSale } = require('../controllers/saleC');

const router = express.Router()

router.get('/', checkToken, getProductSalesCatalog)
router.post('/', checkToken, postSale)

module.exports = router