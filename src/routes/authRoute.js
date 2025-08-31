const express = require('express');
const { registerC, registerStoreC, addCashierC, loginC } = require('../controllers/authC');

const router = express.Router()

router.post('/register-store', registerStoreC)

router.post('/add-cashier', addCashierC)

router.post('/login', loginC)

module.exports = router