const express = require('express');
const { registerC, registerStoreC, addCashierC } = require('../controllers/authC');

const router = express.Router()

router.post('/register-store', registerStoreC)

router.post('/add-cashier', addCashierC)

// router.post('/login', registerC)

module.exports = router