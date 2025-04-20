"use strict";

const { NewConversationModel, HistoryConversationModel } = require("../models/conversation.model.js");
const mongoose = require('mongoose');
const fetch = require('node-fetch');

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

  // get Conversations ID by User ID
  static getConversationsID = async ({ id }) => {
    try {
      const userID = id;
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        console.error("Invalid User ID");
        return { code: 404 };
      }
      const conversations = await HistoryConversationModel.find({ user: userID }).sort({ updatedAt: -1 });

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

  static streamConversation = async (req, res) => {
    try {
      const { id, conversation_id, query } = req.body;

      if (!mongoose.Types.ObjectId.isValid(conversation_id || id)) {
        console.error("Invalid ID");
        return res.status(404).json({ error: "Invalid ID" });
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
            upsert: true
          }
        );
      } else {
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
          { new: true }
        );
      }

      // Request to Coze API
      const queryString = query || "Xin chào";
      const requestBody = {
        query: queryString,
        stream: true,
        conversation_id: chatHistory.conversation_id,
        user: chatHistory.user || "user_demo",
        bot_id: BOT_ID,
        chat_history: chatHistory.chat_history
      };

      // Set the appropriate headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const resp = await fetch(COZE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COZE_API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      if (resp.headers.get('content-type')?.includes('text/event-stream')) {
        const stream = resp.body;
        let buffer = "";
        let completeMessage = "";
        let followUpMessages = [];

        stream.on("data", (chunk) => {
          buffer += chunk.toString();
          let lines = buffer.split("\n");

          for (let i = 0; i < lines.length - 1; i++) {
            let line = lines[i].trim();

            if (!line.startsWith("data:")) continue;
            line = line.slice(5).trim();
            let chunkObj;
            try {
              if (line.startsWith("{")) {
                chunkObj = JSON.parse(line);
              } else {
                continue;
              }
            } catch (error) {
              console.error("Error parsing chunk:", error);
              continue;
            }

            if (chunkObj.event === "message") {
              if (chunkObj.message.role === "assistant") {
                if (chunkObj.message.type === "answer") {
                  let chunkContent = chunkObj.message.content;
                  completeMessage += chunkContent;

                  if (chunkContent !== "") {
                    const chunkId = `chatcmpl-${Date.now()}`;
                    const chunkCreated = Math.floor(Date.now() / 1000);
                    res.write(
                      "data: " +
                      JSON.stringify({
                        id: chunkId,
                        object: "chat.completion.chunk",
                        created: chunkCreated,
                        model: "coze-model",
                        choices: [
                          {
                            index: 0,
                            delta: {
                              content: chunkContent,
                            },
                            finish_reason: null,
                          },
                        ],
                      }) +
                      "\n\n"
                    );
                  }
                } else if (chunkObj.message.type === "follow_up") {
                  // Store follow-up messages to be saved later
                  followUpMessages.push({
                    role: "assistant",
                    type: "follow_up",
                    content: chunkObj.message.content.trim(),
                    content_type: chunkObj.message.content_type || "text"
                  });
                }
              }
            } else if (chunkObj.event === "done") {
              const chunkId = `chatcmpl-${Date.now()}`;
              const chunkCreated = Math.floor(Date.now() / 1000);

              // First, send the completion chunk indicating the message is done
              res.write(
                "data: " +
                JSON.stringify({
                  id: chunkId,
                  object: "chat.completion.chunk",
                  created: chunkCreated,
                  model: "coze-model",
                  choices: [
                    {
                      index: 0,
                      delta: {},
                      finish_reason: "stop",
                    },
                  ],
                }) +
                "\n\n"
              );

              // If there are follow-up messages, send them as a separate event
              if (followUpMessages.length > 0) {
                res.write(
                  "data: " +
                  JSON.stringify({
                    id: `follow-up-${Date.now()}`,
                    object: "chat.completion.follow_up",
                    created: Math.floor(Date.now() / 1000),
                    model: "coze-model",
                    follow_up_messages: followUpMessages
                  }) +
                  "\n\n"
                );
              }

              // Send the final [DONE] message
              res.write("data: [DONE]\n\n");
              res.end();

              // Save assistant response to chat history after stream ends
              if (completeMessage) {
                const messagesToSave = [];

                if (completeMessage) {
                  messagesToSave.push({
                    id: `chatcmpl-${Date.now()}`,
                    role: "assistant",
                    type: "answer",
                    content: completeMessage.trim(),
                    content_type: "text",
                    createdAt: new Date()
                  });
                }

                HistoryConversationModel.findByIdAndUpdate(
                  chatHistory._id,
                  { $push: { chat_history: { $each: messagesToSave } } }
                ).catch(err => console.error("Error saving response to history:", err));
              }
            } else if (chunkObj.event === "ping") {
              // Ignore ping events
            } else if (chunkObj.event === "error") {
              let errorMsg = chunkObj.code + " " + chunkObj.message;

              if (chunkObj.error_information) {
                errorMsg = chunkObj.error_information.err_msg;
              }

              console.error('Error: ', errorMsg);

              res.write(
                `data: ${JSON.stringify({
                  error: {
                    error: "Unexpected response from Coze API.",
                    message: errorMsg
                  }
                })}\n\n`
              );
              res.write("data: [DONE]\n\n");
              res.end();
            }
          }

          buffer = lines[lines.length - 1];
        });

        stream.on("error", (error) => {
          console.error("Stream error:", error);
          res.write(
            `data: ${JSON.stringify({
              error: {
                error: "Stream error",
                message: error.message
              }
            })}\n\n`
          );
          res.write("data: [DONE]\n\n");
          res.end();
        });
      } else {
        const data = await resp.json();

        if (data.code === 0 && data.msg === "success") {
          const messages = data.messages;

          // Get both answer and follow_up messages
          let assistantMessages = messages.filter(
            (message) =>
              message.role === "assistant" &&
              (message.type === "answer" || message.type === "follow_up")
          );

          const answerMessage = assistantMessages.find(message => message.type === "answer");
          const followUpMessages = assistantMessages.filter(message => message.type === "follow_up");
          if (answerMessage) {
            const result = answerMessage.content.trim();
            const usageData = {
              prompt_tokens: 100,
              completion_tokens: 10,
              total_tokens: 110,
            };
            const chunkId = `chatcmpl-${Date.now()}`;
            const chunkCreated = Math.floor(Date.now() / 1000);

            const formattedResponse = {
              id: chunkId,
              object: "chat.completion",
              created: chunkCreated,
              model: "coze-model",
              choices: [
                {
                  index: 0,
                  message: {
                    role: "assistant",
                    content: result,
                  },
                  logprobs: null,
                  finish_reason: "stop",
                },
              ],
              usage: usageData,
              system_fingerprint: "fp_2f57f81c11",
            };

            // Save response to chat history
            const messagesToSave = answerMessage.map(message => ({
              role: "assistant",
              type: message.type,
              content: message.content.trim(),
              content_type: message.content_type || "text"
            }));

            HistoryConversationModel.findByIdAndUpdate(
              chatHistory._id,
              { $push: { chat_history: { $each: messagesToSave } } }
            ).catch(err => console.error("Error saving response to history:", err));

            const jsonResponse = JSON.stringify(formattedResponse, null, 2);
            res.set("Content-Type", "application/json");
            res.send(jsonResponse);
          } else {
            res.status(500).json({ error: "No answer message found." });
          }
        } else {
          console.error("Error:", data.msg);
          res
            .status(500)
            .json({
              error: {
                error: "Unexpected response from Coze API.",
                message: data.msg
              }
            });
        }
      }
    } catch (error) {
      console.error("Error in streamConversation:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
      }
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