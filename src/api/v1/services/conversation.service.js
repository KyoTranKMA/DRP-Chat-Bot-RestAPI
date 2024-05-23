"use strict";

const { NewConversationModel, HistoryConversationModel } = require("../models/conversation.model.js");
// Lodash
const { getInfoData } = require("../utils/index.js");
const fetch = require('node-fetch')

require('dotenv').config();
// AI Service API env
const BOT_ID = process.env.BOT_ID;
const COZE_API_KEY = process.env.COZE_API_KEY;
const COZE_API_URL = process.env.COZE_API_URL;
class ConversationService {
    static initConversation = async ({ id }) => {
        try {
            const userID = id;
            const result = await NewConversationModel.create({ user: userID });
            if (!result) {
                return { code: 404 };
            }
            return {
                code: 200,
                conversation_id: result._id,
            };
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" }
        }
    }
    static newConversation = async ({ id, conversation_id, query }) => {
        try {
            // Find the Conversation or create a new one and save user query
            const chatHistory = await HistoryConversationModel.findOneAndUpdate(
                { conversation_id },
                {
                    $push: {
                        chat_history: {
                            role: "user",
                            content: query,
                            content_type: "text"
                        }
                    },
                    $set: { 
                        user: id 
                    }
                },
                {
                    new: true,
                    upsert: true
                }
            );

            // Override request to Coze API
            const queryString = query || "Xin chào";
            const requestBody = {
                query: queryString,
                stream: false,
                conversation_id: chatHistory.conversation_id,
                user: chatHistory.user || "user_demo",
                bot_id: BOT_ID,
                chat_history: chatHistory.chat_history
            };

            console.log("Request Body:", requestBody);

            const response = await fetch(COZE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${COZE_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (data.code === 0 && data.msg === "success") {
                const messages = data.messages;
                const assistantMessages = messages.filter(
                    (message) =>
                        message.role === "assistant" &&
                        (message.type === "answer" || message.type === "follow_up")
                ).map((message) => ({
                    role: "assistant",
                    type: message.type,
                    content: message.content.trim(),
                    content_type: message.content_type
                }));

                // Save answer to chat history
                const answerMessages = assistantMessages.filter(message => message.type === "answer");

                if (answerMessages.length > 0) {
                    await HistoryConversationModel.findByIdAndUpdate(
                        chatHistory._id,
                        {
                            $push: { chat_history: { $each: answerMessages } }
                        }
                    );
                }

                return {
                    code: 200,
                    messages: assistantMessages
                };
            } else {
                console.error("Unexpected response from Coze API:", data);
                return { code: 500, message: "Unexpected response from Coze API" };
            }
        } catch (error) {
            console.error("Error in newConversation:", error);
            return { code: 500, message: "Internal server error" };
        }
    };
    static getConversation = async ({ conversation_id }) => {
        try {
            // Find the conversation by ID
            const chatHistory = await HistoryConversationModel.findOne({
                conversation_id: conversation_id
            });

            // Check conversation exists
            if (!chatHistory) {
                return { code: 404 };
            }

            return {
                code: 200,
                messages: chatHistory.chat_history
            };
        } catch (error) {
            console.error("Error in getConversation:", error);
            return { code: 500, message: "Internal server error" };
        }
    };
   
}
module.exports = {
    ConversationService
};





