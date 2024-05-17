'use strict'

const mongoose = require('mongoose');
// Table
const COLLECTION_NAME = 'user_info'
// Row
const DOCUMENT_NAME = 'user_info';


// Declare the Schema of the User model
var userInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        maxLength: 50,
        default: ""
    },
    age: {
        type: Number,
        min: [0, 'Tuổi phải là số dương'],
        default: 0
    },
    height: {
        type: Number,
        min: [0, 'Chiều cao phải là số dương'],
        default: 0
    },
    dateOfBirth: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        min: [0, 'Cân nặng phải là số dương'],
        default: 0
    },
    bmi: {
        type: Number,
        min: [0, 'BMI phải là số dương'],
        default: 0
    }
},
{
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userInfoSchema); 