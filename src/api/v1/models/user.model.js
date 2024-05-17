'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
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
        type: Schema.Types.ObjectId,
        ref: 'User_info',
        required: true,    
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema); 