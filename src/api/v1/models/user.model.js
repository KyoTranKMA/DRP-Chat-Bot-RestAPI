'use strict'

const mongoose = require('mongoose');
let validator = require('validator')
// Table
const COLLECTION_NAME = 'users'
// Row
const DOCUMENT_NAME = 'user';


// Declare the Schema of the User model
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 20,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
          return validator.isEmail(value)
        }
      },
    role: {
        type: String,
        enum: ['admin', 'contributor', 'user'],
        default: 'user',
    },
    verify: {
        type: Boolean,
        default: false,
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
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema); 