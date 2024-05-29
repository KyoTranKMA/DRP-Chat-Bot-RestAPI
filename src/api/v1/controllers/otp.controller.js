'use strict';

const { OtpService } = require('../services/otp.service');

class OtpController {
    sendOTPSignUp = async (req, res, next) => {
        try {
            const sendOTPResult = await OtpService.sendOTPSignUp(req.body);
            res.status(sendOTPResult.code).json(sendOTPResult);
        } catch (error) {
            next(error);
        }
    }
    sendOTPForgotPassword = async (req, res, next) => {
        try {
            const sendOTPResult = await OtpService.sendOTPForgotPassword(req.body);
            res.status(sendOTPResult.code).json(sendOTPResult);
        } catch (error) {
            next(error);
        }
    }
    verifyOTP = async (req, res, next) => {
        try {
            const verifyOTPResult = await OtpService.verifyOTP(req.body);
            res.status(verifyOTPResult.code).json(verifyOTPResult);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new OtpController();
