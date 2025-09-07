const express = require('express');
const { registerC, registerStoreC, loginC, addEmployeeC } = require('../controllers/authC');

const router = express.Router()

router.post('/register-store', registerStoreC)

router.post('/add-employee', addEmployeeC)

router.post('/login', loginC)

module.exports = router