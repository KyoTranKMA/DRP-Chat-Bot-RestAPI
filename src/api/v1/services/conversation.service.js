"use strict";

const { NewConversationModel, HistoryConversationModel } = require("../models/conversation.model.js");
const mongoose = require('mongoose');
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
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.error("Invalid User ID");
        return { code: 404 };
      }
      const result = await
        NewConversationModel.create({ user: userID });
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
  // get Conversations ID by User ID
  static getConversationsID = async ({ id }) => {
    try {
      const userID = id;
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.error("Invalid User ID");
        return { code: 404 };
      }
      const conversations = await HistoryConversationModel.find({ user: userID }).sort({ updatedAt: -1 });

      if (conversations.length === 0) {
        return { code: 404 };
      }
      const formattedConversations = conversations.map(conversation => {

        let date = new Date(conversation.updatedAt);
        let formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        return {
          conversation_id: conversation.conversation_id,
          title: conversation.title,
          updated_at: formattedDate
        };
      });

      return {
        code: 200,
        data: formattedConversations
      };
    } catch (error) {
      console.error("Error in getConversationID:", error);
      return { code: 500, message: "Internal server error" };
    }
  };
  static newConversation = async ({ id, conversation_id, query }) => {
    // Create transaction session
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (!mongoose.Types.ObjectId.isValid(conversation_id || id)) {
        console.error("Invalid ID");
        return { code: 404 };
      }
      // Find the Conversation or create a new one and save user query
      let chatHistory = await HistoryConversationModel.findOne({ conversation_id: conversation_id });

      if (!chatHistory) {
        let first_content = query.split(' ').slice(0, 6).join(' ');
        if (query.split(' ').length > 6) {
          first_content += "...";
        }
        chatHistory = await HistoryConversationModel.findOneAndUpdate(
          { conversation_id: conversation_id },
          {
            title: first_content,
            chat_history: [{
              role: "user",
              content: query,
              content_type: "text"
            }],
            user: id
          },
          {
            new: true,
            upsert: true,
            session
          }
        );
      }
      else {
        chatHistory = await HistoryConversationModel.findOneAndUpdate(
          { conversation_id },
          {
            $push: {
              chat_history: {
                role: "user",
                content: query,
                content_type: "text"
              }
            }
          },
          {
            new: true,
            session
          }
        );
      }
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
        let assistantMessages = messages.filter(
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
            },
            { session }
          );
        }

        await session.commitTransaction();
        session.endSession();
        return {
          code: 200,
          messages: assistantMessages
        };
      } else {
        console.error("Unexpected response from Coze API:", data);
        await session.abortTransaction();
        return { code: 500, message: "Unexpected response from Coze API" };
      }
    } catch (error) {
      await session.abortTransaction();
      console.error("Error in newConversation:", error);
      return { code: 500, message: "Internal server error" };
    }
  };

  static updateTitle = async ({ conversation_id, title }) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(conversation_id)) {
        console.error("Invalid ID");
        return { code: 404 };
      }
      const chatHistory = await HistoryConversationModel.findOneAndUpdate(
        { conversation_id: conversation_id },
        { title: title },
        { new: true }
      );
      if (!chatHistory) {
        return { code: 404 };
      }
      return {
        code: 200,
        title: chatHistory.title
      };
    } catch (error) {
      console.error("Error in updateTitle:", error);
      return { code: 500, message: "Internal server error" };
    }
  }
  // get History of Conversation by Conversation ID
  static getHistory = async ({ conversation_id }) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(conversation_id)) {
        console.error("Invalid Conversation ID");
        return { code: 404 };
      }
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









