const express = require('express');
const { getAllSupplierC, getDetailSupplierC, addSupplierC } = require('../controllers/supplierC');
const { checkToken } = require('../middleware/authMiddleware');
const router = express.Router()

router.get('/', checkToken, getAllSupplierC)
router.get('/:id', checkToken, getDetailSupplierC)
router.post('/', checkToken, addSupplierC)

  module.exports = router