const express = require('express');
const { getAllSupplierC, getDetailSupplierC, addSupplierC, updateSupplier, softDeleteSupplier } = require('../controllers/supplierC');
const { checkToken } = require('../middleware/authMiddleware');
const router = express.Router()

router.get('/', checkToken, getAllSupplierC)
router.get('/:id', checkToken, getDetailSupplierC)
router.post('/', checkToken, addSupplierC)
router.put('/:id', checkToken, updateSupplier)
router.delete('/:id', checkToken, softDeleteSupplier)

  module.exports = router