'use strict';

const { AccessService } = require('../services/access.service');

class AccessController {
    signUp = async (req, res, next) => {
        try {
            const signUpResult = await AccessService.signUp(req.body);
            res.status(signUpResult.code).json(signUpResult);
        } catch (error) {
            next(error);
        }
    }
    login = async (req, res, next) => {
        try {
            const loginResult = await AccessService.login(req.body);
            res.status(loginResult.code).json(loginResult);
        } catch (error) {
            next(error);
        }
    }
    requestRefreshToken = async (req, res, next) => {
        try {
            const refreshResult = await AccessService.requestRefreshToken(req.body);
            res.status(refreshResult.code).json(refreshResult);
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new AccessController();
