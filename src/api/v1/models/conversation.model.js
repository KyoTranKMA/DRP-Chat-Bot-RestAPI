"use strict";

const mongoose = require("mongoose");


// Collection names and document names
const COLLECTION_NAME_1 = "conversation";
const DOCUMENT_NAME1 = "Conversation";
const COLLECTION_NAME_2 = "conversation_history";
const DOCUMENT_NAME2 = "HistoryConversation";

// Declare the Schema of the Mongo model
const newConversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: COLLECTION_NAME_1
    }
);



const historyConversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        conversation_id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
            required: true,
            ref: "Conversation",
        },
        chat_history: {
            type: [
                {
                    _id: false,
                    role: { type: String, default: "assistant"},
                    content: { type: String, required: true },
                    content_type: { type: String, default: "text" }
                }
            ],
            default: [],          
        }
    },
    {
        collection: COLLECTION_NAME_2,
        timestamps: true,
    }
);



const NewConversationModel = mongoose.model(DOCUMENT_NAME1, newConversationSchema);
const HistoryConversationModel = mongoose.model(DOCUMENT_NAME2, historyConversationSchema);
// Export the models
module.exports = { NewConversationModel, HistoryConversationModel };


