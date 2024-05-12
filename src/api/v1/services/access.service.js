"use strict";

const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const keytokenModel = require("../models/keytoken.model");
const { createToken, verifyRefreshToken } = require("../auth/authUtils");
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

            const hashPassword = await bcrypt.hash(password, 10);
            const newAccount = await userModel.create({
                username: username,
                email: email,
                password: hashPassword,
            });

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
                name: user.username,
                role: user.role
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
        const refreshToken = req.refreshToken;
        if (!refreshToken) {
            return { code: 401, message: "Empty token" };
        }

        const findToken = await keytokenModel.findOne({ refreshToken: refreshToken });

        if (!findToken) {
            return { code: 403, message: "Invalid token" };
        }

        await verifyRefreshToken(req, res, next);

        const newToken = await createToken(
            {
                id: req.user.id,
                name: req.user.name,
                role: req.user.role
            })

        return {
            code: 200,
            message: "Access token refreshed successfully",
            accessToken: newToken.accessToken
        }
    }
}

module.exports = {
    AccessService,
};
