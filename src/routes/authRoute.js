const express = require('express');
const { registerC } = require('../controllers/authC');

const router = express.Router()

router.post('/login', registerC)
// router.post('/register')

module.exports = router