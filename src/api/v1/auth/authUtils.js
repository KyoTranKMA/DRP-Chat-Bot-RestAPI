'use strict'

const JWT = require('jsonwebtoken')
require('dotenv').config()
const keytokenModel = require("../models/keytoken.model");
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY


const createToken = async (payload) => {
    try {
        const accessToken = await JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '120s'
        })
        const refreshToken = await JWT.sign(payload,
            REFRESH_TOKEN_SECRET_KEY, {
            algorithm: 'HS256'
        }
        )
        return { accessToken, refreshToken }
    }
    catch (error) {
        return error
    }
}

const verifyToken = (req, res, next) => {
    const authorization = req.headers['authorization']
    const token = authorization.split(' ')[1];
    if (!token) {
        return {
            code: 401,
            message: "Unauthorize user",
        }
    }
    try {
        // Decode payload of user
        const decoded = JWT.verify(token, ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded
        return {
            code: 200,
            message: "Authen successfully",
        }
    } catch (e) {
        return {
            code: 400,
            message: "Token not valid",
        }
    }
}

const verifyRefreshToken = async(req, res, next) => {
    const authorization = await req.headers['authorization']
    const token = await authorization.split(' ')[1];
    const checkValid = await keytokenModel.findOne({ refreshToken: token });

    if (!token) {
        return {
            code: 401,
            message: "Unauthorize user",
        }
    }
    else if(!checkValid){
        return {
            code: 404,
            message: "Refresh token not found in database",
        }
    }
    try {
        // Decode payload of user
        const decoded = JWT.verify(token, REFRESH_TOKEN_SECRET_KEY);
        req.user = decoded
        return {
            code: 200,
            message: "Authen successfully",
        }
    } catch (e) {
        return {
            code: 400,
            message: "Token not valid",
        }
    }
}



module.exports = {
    createToken, verifyToken, verifyRefreshToken
}