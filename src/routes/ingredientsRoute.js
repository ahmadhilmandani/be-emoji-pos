const express = require('express');
const { getAllIngredients, addIngredients, purchaseIngredient } = require('../controllers/ingredientsC');
const { checkToken } = require('../middleware/authMiddleware');
const router = express.Router()

router.get('/', checkToken, getAllIngredients)
router.post('/', checkToken, addIngredients)
router.post('/purchase', checkToken, purchaseIngredient)

module.exports = router