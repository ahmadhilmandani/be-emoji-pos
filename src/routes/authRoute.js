const express = require('express');
const { registerC } = require('../controllers/authC');

const router = express.Router()

router.post('/register-store', registerStoreC)

router.post('/add-cashier', registerC)

// router.post('/login', registerC)

module.exports = router