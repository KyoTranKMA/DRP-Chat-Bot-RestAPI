'use strict'

const express = require('express')
const AccessController = require('../../controllers/access.controller')
const UpdateController = require('../../controllers/update.controller.js')
const OtpController = require('../../controllers/otp.controller.js')
const router = express.Router()


// Test admin auth
router.get('/admin', AccessController.verifyAdmin, (req, res, next) => {
    return res.status(200).json({
        message: 'Authen Succesfully',
        status: 'OK'
    })
})

//sign Up 
router.post('/sign-up', AccessController.signUp)
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
// send otp for sign-up
router.post('/sendOTP', OtpController.sendOTPSignUp);
// reset password
router.post('/reset/password', AccessController.resetPassword);
// get otp for reset password
router.post('/reset/getOTP', OtpController.sendOTPForgotPassword)
// verify OTPs
router.post('/verifyOTP', OtpController.verifyOTP);

module.exports = router