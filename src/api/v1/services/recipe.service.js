"use strict";

const recipeModel = require("../models/recipe.model.js");

const { getArrayInfoData } = require("../utils/index.js");

class RecipeService {
    static getAllRecipes = async (req, res) => {
        try {
            const recipes = await recipeModel.find();
            if (!recipes) {
                const message = "Không tìm thấy bất công thức";
                res.status(404).json(message);
            }
            res.status(200).json(getArrayInfoData({
                fields: ['Name', 'Ingredients', 'Instructions'],
                object: recipes
            }));
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
    static getRecipesPaging = async (req, res) => {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 50;           
            const offset = (page - 1) * limit;
            const recipes = await recipeModel.find().skip(offset).limit(limit);
            if (!recipes) {
                const message = "Không tìm thấy bất công thức";
                res.status(404).json(message);
            }
            res.status(200).json(getArrayInfoData({
                fields: ['Name', 'Ingredients', 'Instructions'],
                object: recipes
            }));
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }

}

module.exports = {
    RecipeService
};
