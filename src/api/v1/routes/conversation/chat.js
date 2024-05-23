'use strict'

const express = require('express')
const ConversationController = require('../../controllers/conversation.controller.js')
const router = express.Router()

//new conversation 
router.post('/conversation/init', ConversationController.initConversation)
router.post('/conversation/newChat', ConversationController.newConversation)

//history conversation 
router.post('/conversation/getHistory', ConversationController.getConversation)


module.exports = router