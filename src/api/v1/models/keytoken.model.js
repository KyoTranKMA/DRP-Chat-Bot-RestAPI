"use strict";

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const DOCUMENT_NAME = "key";
const COLLECTION_NAME = "keys";

// Declare the Schema of the Mongo model
const keyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        publicKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: Array,        
            default: [],
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
