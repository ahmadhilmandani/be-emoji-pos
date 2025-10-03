const express = require('express');
const { getAllUserInfo } = require('../controllers/userInfoC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getAllUserInfo)

// router.post('/', getAllUserInfo)

// router.post('/:id', addCashierC)


module.exports = router