const express = require('express');
const { getAllUserInfo, getDetailUserC } = require('../controllers/userInfoC');
const { checkToken } = require('../middleware/authMiddleware');

const router = express.Router()

router.get('/', checkToken, getAllUserInfo)

router.get('/:id', checkToken, getDetailUserC)

// router.post('/', getAllUserInfo)



module.exports = router