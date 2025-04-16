'use strict'

const express = require('express')
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const userValidation = require('../../validations/user.validation');
const AccessController = require('../../controllers/access.controller')
const UpdateController = require('../../controllers/update.controller.js')
const MailController = require('../../controllers/mail.controller.js')
const router = express.Router()



//sign Up 
router.post('/sign-up', validate(authValidation.signUp), AccessController.signUp)
// Update Info of Account
router.post('/account/updateInfo', validate(userValidation.updateAccount),
    UpdateController.updateAccount
)
// get Info of Accounts
router.post('/account/getInfo',
    UpdateController.getInfoAccount
)
// login 
router.post('/login', validate(authValidation.login), AccessController.login)
// logout  
router.post('/logout', validate(authValidation.logout),AccessController.logout)
// authenticate token
router.get('/authenticate', validate(authValidation.token),AccessController.authenToken)
// refresh token
router.get('/refreshToken', validate(authValidation.token),AccessController.requestRefreshToken)
// send otp for sign-up
router.post('/sendOTP', validate(authValidation.verifyEmail),MailController.sendOTPSignUp);
// get otp for reset password
router.post('/reset/password/getOTP', validate(authValidation.verifyEmail),MailController.sendOTPForgotPassword)
// reset password
router.post('/change/password', validate(authValidation.changePassword), AccessController.changePassword);
// forget password
router.post('/reset/password', validate(authValidation.forgetPassword), AccessController.forgetPassword);

// verify OTPs
router.post('/verifyOTP', validate(authValidation.verifyOTP),MailController.verifyOTP);

module.exports = router