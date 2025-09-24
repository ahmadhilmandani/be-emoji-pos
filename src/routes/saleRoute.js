const express = require('express');
const { checkToken } = require('../middleware/authMiddleware');
const { getProductSalesCatalog } = require('../controllers/saleC');

const router = express.Router()

router.get('/', checkToken, getProductSalesCatalog)

module.exports = router