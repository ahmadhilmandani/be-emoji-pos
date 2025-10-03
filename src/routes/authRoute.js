const express = require('express');
const { loginC, addEmployeeC, addOwnerStoreC, softDeleEmployeeC, updateEmployeeC } = require('../controllers/authC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/add-owner-store', addOwnerStoreC)

router.post('/add-employee', addEmployeeC)

router.post('/login', loginC)

router.put('/:id', checkToken, updateEmployeeC)

router.delete('/:id', checkToken, softDeleEmployeeC)

module.exports = router