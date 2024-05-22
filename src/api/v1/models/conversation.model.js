"use strict";

const mongoose = require("mongoose");
require('dotenv').config();
const BOT_ID = process.env.BOT_ID;

// Collection names and document names
const COLLECTION_NAME_1 = "conversation";
const DOCUMENT_NAME1 = "NewConversation";
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
        bot_id: {
            type: Number,
            default: BOT_ID,
            ref: "Bot",
        },
        conversation_id: {
            type: Number,
            unique: true,
            required: true,
            ref: "Conversation",
        },
        query: {
            type: String
        },
        chat_history: {
            type: Array,
            default: [],
        },
        stream: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: COLLECTION_NAME_2,
        timestamps: true,
    }
);
// Trigger get chat_history based on conversation_id
// historyConversationSchema.pre('save', async function(next) {
//     try {
//         const conversations = await newConversationSchema.find({ conversation_id: this.conversation_id });
//         this.chat_history = conversations.map(conversation => conversation.query);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });


const NewConversationModel = mongoose.model(DOCUMENT_NAME1, newConversationSchema);
const HistoryConversationModel = mongoose.model(DOCUMENT_NAME2, historyConversationSchema);
// Export the models
module.exports = { NewConversationModel, HistoryConversationModel };


