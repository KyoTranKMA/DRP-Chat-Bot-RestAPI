'use strict';

const { OtpService } = require('../services/otp.service');

class OtpController {
    sendOTP = async (req, res, next) => {
        console.log("request body", req.body)
        try {
            const sendOTPResult = await OtpService.sendOTP(req.body);
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
