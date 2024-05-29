"use strict"
const Otps = require('../models/otp.model.js');
const randomstring = require('randomstring');
const sendEmail = require('../auth/sendEmailUtils.js');
const userModel = require("../models/user.model.js");

class OtpService {
    // Generate OTP
    static generateOTP = () => {
        return randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
    }
    // Send OTP for Sign Up
    static sendOTPSignUp = async ({ email }) => {
        try {
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return { code: 400, message: "Email đã tồn tại" };
            }
            // Generate OTP
            const otp = this.generateOTP();
            const newOTP = new Otps({ email, otp });
            await newOTP.save();

            // Send OTP via email
            await sendEmail({
                to: email,
                subject: 'DRP Team Chat Bot OTP',
                message: `<p>Mã OTP để đăng ký tài khoản của bạn là: <strong>${otp}</strong></p>`,
            });
            return {
                message: 'Đã gửi mã OTP thành công',
                code: 200,
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return {
                message: 'Gửi mã OTP thất bại',
                code: 500,
            };
        }
    }
    // Send OTP for Forgot Password
    static sendOTPForgotPassword = async ({ email }) => {
        try {
            const existingEmail = await userModel.findOne({ email });
            if (!existingEmail) {
                return { code: 404, message: "Email không tồn tại" };
            }
            // Generate OTP
            const otp = this.generateOTP();
            const newOTP = new Otps({ email, otp });
            await newOTP.save();

            // Send OTP via email
            await sendEmail({
                to: email,
                subject: 'DRP Team Chat Bot OTP',
                message: `<p>Mã OTP xác nhận để đổi mật khẩu của bạn là: <strong>${otp}</strong></p>`,
            });
            return {
                message: 'Đã gửi mã OTP thành công',
                code: 200,
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return {
                message: 'Gửi mã OTP thất bại',
                code: 500,
            };
        }
    }
    // verify OTP
    static verifyOTP = async ({ email, otp }) => {
        try {
            const foundOTP = await Otps.findOne({ email, otp });
            if (!foundOTP) {
                return {
                    success: false,
                    message: 'Mã OTP không hợp lệ',
                    code: 400,
                };
            }

            
            await Otps.deleteOne({ email, otp });
            return {
                success: true,
                message: 'Xác thực OTP thành công',
                code: 200,
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                message: 'Lỗi hệ thống',
                code: 500,
            };
        }
    }

}

module.exports = {
    OtpService
};