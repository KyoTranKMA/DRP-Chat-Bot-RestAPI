"use strict";

const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

// Table
const COLLECTION_NAME = "keys";
// Row
const DOCUMENT_NAME = "key";


// Declare the Schema of the Mongo model
const keyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        refreshToken: {
            type: String
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
