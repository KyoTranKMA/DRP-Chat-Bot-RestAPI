'use strict';

const { ConversationService } = require('../services/conversation.service');


class ConversationController {
    initConversation = async (req, res, next) => {
        try {
            const saveResult = await ConversationService.initConversation(req.body);
            res.status(saveResult.code).json(saveResult);
        } catch (error) {
            next(error);
        }
    }
    getConversationsID = async (req, res, next) => {
        try {
            const result = await ConversationService.getConversationsID(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
    newConversation = async (req, res, next) => {
        try {
            const result = await ConversationService.newConversation(req.body);
            res.set("Content-Type", "application/json");
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
    streamingConversation =  (req, res, next) => {
        try {
            ConversationService.streamingConversation(req, res, req.body);
        } catch (error) {
            next(error);
        }
    }
    updateTitleConversation = async (req, res, next) => {  
        try {
            const result = await ConversationService.updateTitle(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
    getHistoryConversation = async (req, res, next) => {
        try {
            const result = await ConversationService.getHistory(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new ConversationController();
