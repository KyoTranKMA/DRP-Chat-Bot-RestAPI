'use strict'

const mongoose = require('mongoose');
// Table
const COLLECTION_NAME = 'recipes_img'
// Row
const DOCUMENT_NAME = 'recipe';

// Declare the Schema of the User model
var recipeSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Category: {
        type: String
    },
    Ingredients: {
        type: Array,
        required: true
    },
    Instructions: {
        type: Array,
        required: true
    },
    Image: {
        type: String
    },
},
{
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, recipeSchema); 