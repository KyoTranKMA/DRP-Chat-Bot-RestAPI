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
    static newConversation = async ({ conversation_id, id, query }) => {
        try {
            const chatHistory = await HistoryConversationModel.findOneAndUpdate(
                {
                    conversation_id: conversation_id
                },
                {
                    $push: {
                        chat_history: {
                            role: "assistant",
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
                });
            // Request body values
            const queryString = query || "Xin chào";
            const stream = false;
            const botID = BOT_ID;
            const conversationID = chatHistory.conversation_id || "conversation_demo";
            const userID = chatHistory.user || "user_demo";
            const chatHistoryArray = chatHistory.chat_history || [];
            const requestBody = {
                query: queryString,
                stream: stream,
                conversation_id: conversationID,
                user: userID,
                bot_id: botID,
                chat_history: chatHistoryArray
            };

            console.log("Request Body:", requestBody);

            const authHeader = COZE_API_KEY;
            const response = await fetch(COZE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authHeader}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            // Check if the response is successful
            if (data.code === 0 && data.msg === "success") {
                const messages = data.messages;
                const formattedMessages = messages
                    .filter(message => message.role === "assistant" && (message.type === "answer" || message.type === "follow_up"))
                    .map(message => {
                        return {
                            type: message.type,
                            content: message.content.trim(),
                            content_type: message.content_type,
                        };
                    });
                return {
                    code: 200,
                    messages: formattedMessages
                };
            } else {
                return { code: 500, message: "Unexpected response from Coze API" }
            }
        }
        catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" }
        }
    }
    static saveHistoryConversation = async ({ user, query, conversation_id }) => {
        try {
            const userInfo = user;
            const queryString = query;
            const conversationId = conversation_id;

            const result = await HistoryConversationModel.create({
                user: userInfo,
                chat_history: queryString,
                conversation_id: conversationId
            });
            return {
                code: 200,
                message: "Success",
                data: result
            };
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" }
        }
    }
    static getHistoryConversation = async ({ conversation_id }) => {
        try {
            const conversationId = conversation_id;
            // Find the user in the database
            const conversationHistory = await HistoryConversationModel.findOne({ conversation_id: conversationId });
            if (!conversationHistory) {
                return { code: 404, message: "Cuộc trò chuyện không tồn tại" };
            }
            return {
                code: 200,
                message: "Success",
                data: getInfoData({
                    fields: ['chat_history', 'createAt'],
                    object: conversationHistory
                })
            };
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" }
        }
    }
    static updateHistoryConversation = async ({ query, conversation_id }) => {
        try {
            const queryString = query;
            const conversationId = conversation_id;

            const result = await HistoryConversationModel.findOneAndUpdate(
                {
                    conversation_id: conversationId,
                },
                {
                    $push: {
                        chat_history: queryString,
                    }
                },
                { new: true });
            if (!result) {
                return { code: 404, message: "Cuộc trò chuyện không tồn tại" };
            }
            return {
                code: 200,
                message: "Success",
                data: result
            };
        }
        catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" }
        }
    }
}
module.exports = {
    ConversationService
};





