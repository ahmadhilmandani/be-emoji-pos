const express = require('express');
const { addProductC, getProducts, getProductDetail, updateProductC } = require('../controllers/productC ');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getProducts)
router.get('/:product_id', checkToken, getProductDetail)
router.put('/:product_id', checkToken, updateProductC)
router.post('/', checkToken, addProductC)

module.exports = router