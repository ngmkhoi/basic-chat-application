const authService = require('../services/auth.service');
const { COOKIE, HTTP_STATUS, ERROR_MESSAGES, RESPONSE_MESSAGES} = require('../config/constants');
const emailService = require('../services/email.service');
const { SecretVerify } = require("../config/jwt")
const jwt = require("jsonwebtoken");

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
        }, HTTP_STATUS.OK);
    } catch (error) {
        if (error.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const result = await authService.register({ email, password, full_name });
        res.cookie(COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOptions);
        await emailService.sendVerifyEmail(result.user, "Verify email");
        res.success({
            user: result.user,
            accessToken: result.accessToken,
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
        if (error.message === 'User does not exist') {
            return res.error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
        }
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
            accessToken: result.accessToken,
        }, HTTP_STATUS.OK);
    } catch (error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, error.message);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[COOKIE.REFRESH_TOKEN_NAME];

        if (!refreshToken) {
            res.clearCookie(COOKIE.REFRESH_TOKEN_NAME);
            return res.success(ERROR_MESSAGES.LOGOUT_SUCCESS, HTTP_STATUS.OK);
        }

        await authService.logoutUser(refreshToken);
        res.clearCookie(COOKIE.REFRESH_TOKEN_NAME);
        res.success(ERROR_MESSAGES.LOGOUT_SUCCESS, HTTP_STATUS.OK);
    } catch (error) {
        res.clearCookie(COOKIE.REFRESH_TOKEN_NAME);
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) {
            return res.error(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.INVALID_VERIFY_TOKEN);
        }
        const payload = jwt.verify(token, SecretVerify);
        const result = await authService.verifyEmail(payload.id);
        res.success(result);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.VERIFY_TOKEN_EXPIRED);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.error(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_VERIFY_TOKEN);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

const resendVerifyToken = async (req, res, next) => {
    try {
        const user = req.user
        await emailService.sendVerifyEmail(user, "Verify email");
        res.success(RESPONSE_MESSAGES.RESEND_VERIFY_TOKEN, HTTP_STATUS.OK);
    } catch (error) {
        if(error.message !== ERROR_MESSAGES.INTERNAL_ERROR){
            return res.error(HTTP_STATUS.CONFLICT, error.message);
        }
        res.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
}

module.exports = {
    login,
    createUser,
    getUserInfo,
    refreshToken,
    logout,
    verifyEmail,
    resendVerifyToken
}
