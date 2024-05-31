'use strict'

const express = require('express')
const ConversationController = require('../../controllers/conversation.controller.js')
const router = express.Router()

//new conversation 
router.post('/conversation/init', ConversationController.initConversation)
router.post('/conversation/newChat', ConversationController.newConversation)
router.post('/conversation/streamingChat', ConversationController.streamingConversation)

// get conversations ID of user
router.post('/conversation/getConversations', ConversationController.getConversationsID)
// update title conversation
router.post('/conversation/updateTitle', ConversationController.updateTitleConversation)
//history conversation 
router.post('/conversation/getHistory', ConversationController.getHistoryConversation)


module.exports = router