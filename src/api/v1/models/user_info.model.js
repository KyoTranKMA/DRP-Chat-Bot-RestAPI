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
        ref: 'user',
        required: true,
    },
    info: {
        type: Object,
        default: {
            name: "",
            age: null,
            height: null,
            dateOfBirth: null,
            weight: null,
            bmi: null
        },
        name: {
            type: String,
            maxLength: 50,
        },
        age: {
            type: Number,
            min: [0, 'Tuổi phải là số dương'],
        },
        height: {
            type: Number,
            min: [0, 'Chiều cao phải là số dương']
        },
        dateOfBirth: {
            type: Date,
        },
        weight: {
            type: Number,
            min: [0, 'Cân nặng phải là số dương']
        },
        bmi: {
            type: Number,
        }
    }
}, {
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userInfoSchema); 