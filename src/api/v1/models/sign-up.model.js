'use strict'

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'User';


// Declare the Schema of the User model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        maxLength: 150,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    verify:{
        type: Boolean,
        default: false,
    }
    
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema); 