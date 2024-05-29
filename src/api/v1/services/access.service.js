"use strict";

const userModel = require("../models/user.model.js");
const userInfoModel = require("../models/user_info.model.js");
const { OtpService } = require("./otp.service.js");
const bcrypt = require("bcrypt");
const keytokenModel = require("../models/keytoken.model");
const { createToken, verifyRefreshToken, verifyToken} = require("../auth/authUtils");
const { getInfoData } = require("../utils/index.js");
// AI Service API
require('dotenv').config()
const COZE_API_KEY = process.env.COZE_API_KEY;

class AccessService {
    static signUp = async ({ username, email, password }) => {
        try {
            // Check if account exists
            const existingUsername = await userModel.findOne({ username });
            if (existingUsername) {
                return { code: 400, message: "Tên tài khoản đã tồn tại" };
            }

            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return { code: 400, message: "Email đã tồn tại" };
            }

            const userInfo = new userInfoModel();
            await userInfo.save();

            const hashPassword = await bcrypt.hash(password, 10);
            const newAccount = await userModel.create({
                username: username,
                email: email,
                password: hashPassword,
                info: userInfo._id
            });

            userInfo.user = newAccount._id;
            await userInfo.save();
            
            if (newAccount) {
                return { code: 201, message: "Đăng ký tài khoản thành công" };
            } else {
                return { code: 400, message: "Đăng ký tài khoản không thành công" };
            }
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" };
        }
    };

    static login = async ({ username, password }) => {
        try {
            // Find the user in the database
            const user = await userModel.findOne({ username: username });
            if (!user) {
                return { code: 404, message: "Vui lòng nhập lại tên tài khoản" };
            }

            const verifyPassword = await bcrypt.compare(
                password,
                user.password
            )
            // Check password
            if (!verifyPassword) {
                return { code: 404, message: "Vui lòng nhập lại mật khẩu" };
            }

            // Create Access token for user
            const tokens = await createToken({
                id: user._id,
                username: user.username,
                role: user.role,
                email: user.email
            });
            if (tokens) {
                await keytokenModel.findOneAndUpdate(
                    { user: user._id },
                    { refreshToken: tokens.refreshToken, user: user._id },
                    { upsert: true }
                );
                return {
                    code: 200,
                    message: "Đăng nhập tài khoản thành công",
                    account: getInfoData({
                        fields: ['id', 'username', 'email'],
                        object: user
                    }),
                    tokens,
                    apiKeyAIService: COZE_API_KEY
                }
            }
            else {
                return { code: 400, message: "No tokens provided" };
            }
        } catch (error) {
            console.error(error);
            return { code: 500, message: "Internal Server Error" };
        }
    }

    static logout = () => {
        return {
            code: 200,
            message: "Đăng xuất tài khoản thành công"
        }
    }

    static requestRefreshToken = async (req, res, next) => {

        const result = await verifyRefreshToken(req, res, next);
        
        if (result.code === 200) {
            const newToken = await createToken(
                {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role
                });
            return {
                code: result.code,
                message: result.message,
                accessToken: newToken.accessToken
            }
        }
        else {
            return {
                code: result.code,
                message: result.message
            }
        }
    }
    static authenToken = async (req, res, next) => {
        const result = await verifyToken(req, res, next);
        if (result.code === 200) {
            return {
                code: result.code,
                message: result.message,
                account: getInfoData({
                    fields: ['id', 'username', 'email'],
                    object: req.user
                }),
                apiKeyAIService: COZE_API_KEY
            }
        }
        else {
            return {
                code: result.code,
                message: result.message
            }
        }
    }

    static resetPassword = async ({email, password}) => {
        try {
            const user = await userModel.findOne({ email});
            if (!user) {
                return { code: 404};
            }
            const hashPassword = await bcrypt.hash(password, 10);
            await userModel.findOneAndUpdate({ email: email }, { password: hashPassword });
            return { code: 200};
        }
        catch(error){
            console.error(error);
            return { code: 500};
        }
    }


    static verifyAdmin = async (req, res, next) => {
        const result = await verifyToken(req, res, next);
        if (result.code === 200 && req.user.role === 'admin') {
            return {
                code: result.code,
                message: result.message,
                account: getInfoData({
                    fields: ['id', 'username', 'email'],
                    object: req.user
                }),
                apiKeyAIService: COZE_API_KEY
            }
        }
        else {
            return {
                code: result.code,
                message: result.message
            }
        }
    }
    
}

module.exports = {
    AccessService,
};
