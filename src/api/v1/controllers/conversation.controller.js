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
    newConversation = async (req, res, next) => {
        try {
            const result = await ConversationService.newConversation(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
    getHistoryChat = async (req, res, next) => {
        try {
            const result = await ConversationService.getHistoryConversation(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
    saveHistoryChat = async (req, res, next) => {
        try {
            const saveResult = await ConversationService.saveHistoryConversation(req.body);
            res.status(saveResult.code).json(saveResult);
        } catch (error) {
            next(error);
        }
    }
    updateHistoryChat = async (req, res, next) => {
        try {
            const result = await ConversationService.updateHistoryConversation(req.body);
            res.status(result.code).json(result);
        } catch (error) {
            next(error);
        }
    }
   


}

module.exports = new ConversationController();
