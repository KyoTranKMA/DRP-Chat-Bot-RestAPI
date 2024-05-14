'use strict'

const express = require('express')
const ConversationController = require('../../controllers/conversation.controller.js')
const router = express.Router()

// conversation 
router.post('/conversation', ConversationController.saveNewChat)
router.post('/history/conversation', ConversationController.saveHistoryChat)




module.exports = router