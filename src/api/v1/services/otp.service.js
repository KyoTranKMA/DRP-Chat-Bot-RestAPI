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
    // Send OTP
    static sendOTP = async ({ email }) => {
        try {
            // Generate OTP
            const otp = this.generateOTP();
            const newOTP = new Otps({ email, otp });
            await newOTP.save();

            // Send OTP via email
            await sendEmail({
                to: email,
                subject: 'DRP TEAM OTP',
                message: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p>`,
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
            // Update user verify status
            await userModel.findOneAndUpdate({ email }, { verify: true });
            
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
    OtpService,
};