'use strict'

const express = require('express')
const RecipeController = require('../../controllers/recipe.controller.js')
const router = express.Router()

// Get all recipes
router.get('/recipes/vn', RecipeController.getAllRecipes)


module.exports = router