const express = require('express')
const { checkToken } = require('../middleware/authMiddleware')
const { getDetailStore, updateStore } = require('../controllers/storeC')

const router = express.Router()

router.get('/', checkToken, getDetailStore)
router.put('/', checkToken, updateStore)

module.exports = router