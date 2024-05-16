'use strict'

const express = require('express')
const auth = require('../../auth/authUtils.js')
const AccessController = require('../../controllers/access.controller')
const UpdateController = require('../../controllers/update.controller.js')
const ConversationController = require('../../controllers/conversation.controller.js')
const router = express.Router()


router.get('/', auth.verifyToken, (req, res, next) => {
    return res.status(200).json({
        message: 'Authen Succesfully',
        status: 'OK'
    })
})

// Test admin auth
router.get('/admin', auth.verifyAdmin, (req, res, next) => {
    return res.status(200).json({
        message: 'Authen Admin Succesfully',
        status: 'OK'
    })
})
//sign Up 
router.post('/sign-up', AccessController.signUp)
router.get('/sign-up', (req, res, next) => {
    return res.status(200).json({
        message: 'Succesfully',
        status: 'OK'
    })
})
// Update In4
router.post('/update/account',
    UpdateController.updateAccount
)
// login 
router.post('/login', AccessController.login)
// logout  
router.post('/logout', AccessController.logout)
// authenticate token
router.get('/authenticate', AccessController.authenToken)
// refresh token
router.get('/refreshToken', AccessController.requestRefreshToken)




module.exports = router