const authService = require('../services/auth.service');
const { COOKIE, HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');
const authModel = require("../models/auth.model");

const cookieOptions = {
    httpOnly: COOKIE.HTTP_ONLY,
    secure: COOKIE.SECURE,
    path: COOKIE.PATH,
    sameSite: COOKIE.SAME_SITE
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({email, password});

        if (!result) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        res.cookie(COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOptions);

        res.success({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        }, HTTP_STATUS.OK);
    } catch (error) {
        if (error.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const result = await authService.register({ email, password, full_name });

        res.cookie(COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOptions);

        res.success({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }, HTTP_STATUS.CREATED);
    } catch (error) {
        if (error.message === ERROR_MESSAGES.USER_ALREADY_EXISTS) {
            return res.error(HTTP_STATUS.CONFLICT, error.message);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const getUserInfo = async (req, res) => {
     try {
         const userId = req.user.id;
         const userInformation = await authService.getCurrentUser(userId);
         res.success(userInformation);
     } catch (error) {
         res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
     }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN_NAME];
        if (!refreshToken) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_NOT_FOUND);
        }
        const result = await authService.createNewToken(refreshToken);
        res.cookie(COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOptions);

        res.success({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }, HTTP_STATUS.OK);
    } catch (error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
            return res.error(HTTP_STATUS.FORBIDDEN, error.message);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN_NAME];
        if (!refreshToken) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.TOKEN_NOT_FOUND);
        }
        const result = await authService.logoutUser(refreshToken);
        res.success(result, HTTP_STATUS.OK);
        res.clearCookie(COOKIE.REFRESH_TOKEN_NAME);
    } catch (error) {
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
}
module.exports = {
    login,
    createUser,
    getUserInfo,
    refreshToken,
    logout,
}

