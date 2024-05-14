"use strict";

const { NewConversation, HistoryConversation } = require("../models/conversation.model.js");
const { getInfoData } = require("../utils/index.js");

class ConversationService {
    static createConversation = async ({queryString}) => {
        try {
            const result = await NewConversation.create({query: queryString});
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
    static saveHistoryConversation = async ({user,query, conversation_id}) => {
        try {
            const userInfo = user;
            const queryString = query;
            const conversationId = conversation_id;
            console.log("userInfo", userInfo);
            console.log("queryString", queryString);
            console.log("conversationId", conversationId);
    
            const result = await HistoryConversation.create({
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
}
module.exports = {
    ConversationService
};
