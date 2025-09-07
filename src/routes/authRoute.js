const express = require('express');
const { loginC, addEmployeeC, addOwnerStoreC } = require('../controllers/authC');

const router = express.Router()

router.post('/add-owner-store', addOwnerStoreC)

router.post('/add-employee', addEmployeeC)

router.post('/login', loginC)

module.exports = router