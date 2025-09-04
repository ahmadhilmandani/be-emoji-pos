const express = require('express');
const { getAllSupplierC, getDetailSupplierC, addSupplierC } = require('../controllers/supplierC');
const router = express.Router()

router.get('/', getAllSupplierC)
router.get('/:id', getDetailSupplierC)
router.post('/', addSupplierC)
// router.put('/supplier/:id', ()=>{})
// router.delete('/supplier/:id', ()=>{})

  module.exports = router