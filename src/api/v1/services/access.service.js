"use strict";

const signUpModel = require("../models/sign-up.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keytokenModel = require("../models/keytoken.model");
const { KeyTokenService } = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index.js");

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // Check if account exists
            const nameUser = await signUpModel.findOne({ name }).lean();
            if (nameUser){
                return  {
                    code: 226,
                    message: "User name already registered!"
                }
            }
            const emailUser = await signUpModel.findOne({ email }).lean();
            if (emailUser) {
                return {
                    code: 226,
                    message: "Email already registered!",
                };
            }



            // Create new account and hash password with Salt = 10 (default value)
            const hashPassword = await bcrypt.hash(password, 10);
            const newAccount = await signUpModel.create({
                name,
                email,
                password: hashPassword,
            });

            if (newAccount) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                    }
                );

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newAccount._id,
                    publicKey,
                });

                if (!publicKeyString) {
                    return {
                        code: "xxxx",
                        message: "Public KeyString error",
                    };
                }

                // Create token pair
                const tokens = await createTokenPair(
                    { userId: newAccount._id, email },
                    publicKeyString,
                    privateKey
                );

                console.log(`Created token success:`, tokens);

                return {
                    code: 200,
                    metadata: {
                        Account: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newAccount
                        }),
                        tokens,
                    },
                };
            } else {
                return {
                    code: 200,
                    metadata: null,
                };
            }
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: "Internal Server Error",
            };
        }
    };
}

module.exports = {
    AccessService,
};
