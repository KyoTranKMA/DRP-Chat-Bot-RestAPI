const Joi = require('joi');
const { password } = require('./custom.validation');

const signUp = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const token = {
  header: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const forgetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body:
    Joi.object().keys({
      email: Joi.string().email().required()
    }),
};
const verifyOTP = { 
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};

module.exports = {
  signUp,
  login,
  logout,
  token,
  forgotPassword,
  changePassword,
  forgetPassword,
  verifyEmail,
  verifyOTP
};
