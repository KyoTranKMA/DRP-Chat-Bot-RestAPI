"use strict";

const mongoose = require("mongoose");
require('dotenv').config();
const BOT_ID = process.env.BOT_ID;

// Collection names
const COLLECTION_NAME_1 = "conversation";
const COLLECTION_NAME_2 = "conversation_history";

// Declare the Schema of the Mongo model
const newConversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        bot_id: {
            type: Number,
            default: BOT_ID,
            ref: "Bot",
        },
        conversation_id: {
            type: Number,
        },
        query: {
            type: String,
            required: true,
        },
        stream: {
            type: Boolean,
            default: true,
        },
    },
    {
        collection: COLLECTION_NAME_1,
        timestamps: true,
    }
);


// Trigger Auto generate conversation field auto increment
newConversationSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            const latestConversation = await this.constructor.findOne({}, {}, { sort: { 'createdAt' : -1 } });
            if (latestConversation) {
                const lastConversation = latestConversation.conversation_id;
                const nextConversation = lastConversation + 1;
                this.conversation_id = nextConversation;
            } else {
                this.conversation_id = 1;
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});


const historyConversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        bot_id: {
            type: Number,
            default: BOT_ID,
            ref: "Bot",
        },
        conversation_id: {
            type: Number, 
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


const NewConversation = mongoose.model('NewConversation', newConversationSchema);
const HistoryConversation = mongoose.model('HistoryConversation', historyConversationSchema);
// Export the models
module.exports = { NewConversation, HistoryConversation };


