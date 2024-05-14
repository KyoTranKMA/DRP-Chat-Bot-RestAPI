'use strict'

const express = require('express')
const ConversationController = require('../../controllers/conversation.controller.js')
const router = express.Router()

//new conversation 
router.post('/conversation', ConversationController.saveNewChat)
//history conversation 
router.get('/history/conversation', ConversationController.getHistoryChat)
router.patch('/history/conversation', ConversationController.updateHistoryChat)
router.post('/history/conversation', ConversationController.saveHistoryChat)




module.exports = router