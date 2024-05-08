"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, refreshToken }) => {
        try {
            const tokens = await keytokenModel.create({
                user: userId, 
                refreshToken: refreshToken,
            });
            return tokens;
        } catch (error) {
            return error;
        }
    };
}

module.exports = {
    KeyTokenService,
};
