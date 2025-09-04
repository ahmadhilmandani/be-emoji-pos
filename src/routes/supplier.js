const express = require('express');
const { getAllSupplierC, getDetailSupplierC, addSupplierC } = require('../controllers/supplierC');
const router = express.Router()

router.get('/supplier', getAllSupplierC)
router.get('/supplier/:id', getDetailSupplierC)
router.post('/supplier', addSupplierC)
// router.put('/supplier/:id', ()=>{})
// router.delete('/supplier/:id', ()=>{})