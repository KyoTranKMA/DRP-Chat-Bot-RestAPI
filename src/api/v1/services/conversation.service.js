"use strict";

const { NewConversationModel, HistoryConversationModel } = require("../models/conversation.model.js");
const { getInfoData } = require("../utils/index.js");

class ConversationService {
    static createConversation = async ({ id }) => {
        try {
            const userID = id;
            const result = await NewConversationModel.create({user: userID});
            return {
                code: 200,
                conversation_id: result._id,
            };
        } catch (error) {
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
    static updateHistoryConversation = async ({query, conversation_id }) => {
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
            if(!result){
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
