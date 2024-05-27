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
            const conversations = await HistoryConversationModel.find({ user: userID });

            if (conversations.length === 0) {
                return { code: 404 };
            }
            const formattedConversations = conversations.map(conversation => ({
                conversation_id: conversation.conversation_id,
                first_content: conversation.chat_history[0]?.content
            }));
            console.log(formattedConversations)
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
        try {
            console.log("New Conversation:", id, conversation_id, query);
            if (!mongoose.Types.ObjectId.isValid(conversation_id || id)) {
                console.error("Invalid ID");
                return { code: 404 };
            }
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
    static streamingConersation = async ({ id, conversation_id, query }) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(conversation_id || id)) {
                console.error("Invalid ID");
                return { code: 404 };
            }
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
                stream: true,
                conversation_id: chatHistory.conversation_id,
                user: chatHistory.user || "user_demo",
                bot_id: BOT_ID,
                chat_history: chatHistory.chat_history
            };
            
            const response = await fetch(COZE_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${COZE_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            res.setHeader("Content-Type", "text/event-stream");
            const stream = response;
            let buffer = "";

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
                        if (
                            chunkObj.message.role === "assistant" &&
                            chunkObj.message.type === "answer"
                        ) {
                            let chunkContent = chunkObj.message.content;

                            if (chunkContent !== "") {
                                const chunkId = `chatcmpl-${Date.now()}`;
                                const chunkCreated = Math.floor(Date.now() / 1000);
                                res.write(
                                    "data: " +
                                    JSON.stringify({
                                        id: chunkId,
                                        object: "chat.completion.chunk",
                                        created: chunkCreated,
                                        model: data.model,
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
                        }
                    } else if (chunkObj.event === "done") {
                        const chunkId = `chatcmpl-${Date.now()}`;
                        const chunkCreated = Math.floor(Date.now() / 1000);
                        res.write(
                            "data: " +
                            JSON.stringify({
                                id: chunkId,
                                object: "chat.completion.chunk",
                                created: chunkCreated,
                                model: data.model,
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
                        res.write("data: [DONE]\n\n");
                        res.end();
                    } else if (chunkObj.event === "ping") {
                    } else if (chunkObj.event === "error") {
                        console.error(`Error: ${chunkObj.code}, ${chunkObj.message}`);
                        res
                            .status(500)
                            .write(
                                `data: ${JSON.stringify({ error: chunkObj.message })}\n\n`
                            );
                        res.write("data: [DONE]\n\n");
                        res.end();
                    }
                }

                buffer = lines[lines.length - 1];
            });
        }
    catch(error) {
        console.error("Error in newConversation:", error);
        return { code: 500, message: "Internal server error" };
    }
};
    static getConversation = async ({ conversation_id }) => {
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









