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
    logout = async (req, res, next) => {
        try {
            const logoutResult = await AccessService.logout();
            res.status(logoutResult.code).json(logoutResult);
        } catch (error) {
            next(error);
        }
    }
    requestRefreshToken = async (req, res, next) => {
        try {
            const refreshResult = await AccessService.requestRefreshToken(req, res ,next);
            res.status(refreshResult.code).json(refreshResult);
        } catch (error) {
            next(error);
        }
    }
    authenToken = async (req, res, next) => {
        try {
            const authenResult = await AccessService.authenToken(req, res, next);
            res.status(authenResult.code).json(authenResult);
        } catch (error) {
            next(error);
        }
    }
    verifyAdmin = async (req, res, next) => {
        try {
            const verifyResult = await AccessService.verifyAdmin(req, res, next);
            res.status(verifyResult.code).json(verifyResult);
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new AccessController();
