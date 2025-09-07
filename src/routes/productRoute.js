const express = require('express');
const { addProductC, getProducts } = require('../controllers/productC ');

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', ()=>{})
router.post('/', addProductC)

module.exports = router