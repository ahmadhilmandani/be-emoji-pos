const express = require('express');
const { getAllSupplierC, getDetailSupplierC, addSupplierC } = require('../controllers/supplierC');
const router = express.Router()

router.get('/', getAllSupplierC)
router.get('/:id', getDetailSupplierC)
router.post('/', addSupplierC)

  module.exports = router