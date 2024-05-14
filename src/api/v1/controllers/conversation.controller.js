'use strict';

const { ConversationService } = require('../services/conversation.service');


class ConversationController {
    saveNewChat = async (req, res, next) => {
        try {
            const saveResult = await ConversationService.createConversation(req.body);
            res.status(saveResult.code).json(saveResult);
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
