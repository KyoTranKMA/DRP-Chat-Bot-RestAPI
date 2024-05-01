"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            // Extract the public key string
            const publicKeyString = publicKey
                .export({ format: "pem", type: "spki" })
                .toString();
            console.log(`Public Key String::: `, publicKeyString);

            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            });
            console.log("Tokens:", tokens);
            return tokens ? publicKeyString : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = {
    KeyTokenService,
};
