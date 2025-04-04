'use strict';

const { MailService } = require('../services/mail.service');

class MailController {
    sendOTPSignUp = async (req, res, next) => {
        try {
            const sendOTPResult = await MailService.sendOTPSignUp(req.body);
            res.status(sendOTPResult.code).json(sendOTPResult);
        } catch (error) {
            next(error);
        }
    }
    sendOTPForgotPassword = async (req, res, next) => {
        try {
            const sendOTPResult = await MailService.sendOTPForgotPassword(req.body);
            res.status(sendOTPResult.code).json(sendOTPResult);
        } catch (error) {
            next(error);
        }
    }
    verifyOTP = async (req, res, next) => {
        try {
            const verifyOTPResult = await MailService.verifyOTP(req.body);
            res.status(verifyOTPResult.code).json(verifyOTPResult);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new MailController();
