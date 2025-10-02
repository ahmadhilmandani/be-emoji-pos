const express = require('express');
const { getAllIngredients, addIngredients, purchaseIngredient, updateIngredient, getDetailIngredients } = require('../controllers/ingredientsC');
const { checkToken } = require('../middleware/authMiddleware');
const router = express.Router()

router.get('/', checkToken, getAllIngredients)
router.get('/:id', checkToken, getDetailIngredients)
router.post('/', checkToken, addIngredients)
router.post('/purchase', checkToken, purchaseIngredient)
router.put('/:id', checkToken, updateIngredient)

module.exports = router