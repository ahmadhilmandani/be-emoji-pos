const express = require('express');
const { addProductC } = require('../controllers/productC ');

const router = express.Router()

router.get('/', ()=>{})
router.get('/:id', ()=>{})
router.post('/', addProductC)

module.exports = router