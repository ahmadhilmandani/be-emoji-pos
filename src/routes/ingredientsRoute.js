const express = require('express');
const { getAllIngredients, addIngredients } = require('../controllers/ingredientsC');
const router = express.Router()

router.get('/', getAllIngredients)
router.post('/', addIngredients)

  module.exports = router