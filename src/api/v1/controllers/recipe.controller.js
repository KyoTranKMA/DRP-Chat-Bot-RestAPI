
'use strict';

const { RecipeService } = require('../services/recipe.service');

class RecipeController {
    getAllRecipes = (req, res , next) => {
        try {
            RecipeService.getAllRecipes(req, res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RecipeController();
