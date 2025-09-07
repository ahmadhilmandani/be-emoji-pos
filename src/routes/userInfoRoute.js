const express = require('express');
const { getAllUserInfo } = require('../controllers/userInfoC');

const router = express.Router()

router.get('/', getAllUserInfo)

// router.post('/:id', addCashierC)


module.exports = router