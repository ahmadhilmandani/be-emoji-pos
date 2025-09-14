const express = require('express');
const { addProductC, getProducts } = require('../controllers/productC ');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getProducts)
router.get('/:id', ()=>{})
router.post('/', checkToken, addProductC)

module.exports = router