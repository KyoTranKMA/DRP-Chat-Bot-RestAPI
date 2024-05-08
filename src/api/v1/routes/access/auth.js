'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const auth = require('../../auth/authUtils.js')
const router = express.Router()


router.get('/',auth.verifyToken, (req, res, next) => {
    return res.status(200).json( {
        message: 'Authen Succesfully',
        status: 'OK'
    })
})

// Test admin auth
router.get('/admin',auth.verifyAdmin, (req, res, next) => {
    return res.status(200).json( {
        message: 'Authen Admin Succesfully',
        status: 'OK'
    })
})


//sign Up 
router.post('/sign-up', accessController.signUp)
router.get('/sign-up', (req, res, next) => {
    return res.status(200).json( {
        message: 'Succesfully',
        status: 'OK'
    })
})   
// login 
router.post('/login', accessController.login)
// refresh token
router.post('/refreshToken', accessController.requestRefreshToken)




module.exports = router