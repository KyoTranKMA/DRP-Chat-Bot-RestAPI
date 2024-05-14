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
    saveHistoryChat = async (req, res, next) => {
        try {
            const saveResult = await ConversationService.saveHistoryConversation(req.body);
            res.status(saveResult.code).json(saveResult);
        } catch (error) {
            next(error);
        }
    }
   


}

module.exports = new ConversationController();
