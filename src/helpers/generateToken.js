const jwt = require("jsonwebtoken");
const {SecretAccess, SecretRefresh} = require("../config/jwt");
const { AUTH } = require("../config/constants");
const refreshTokenModel = require("../models/revokedToken.model");

const tokenGenerate = async (user, expiresAt) => {
    const accessToken = jwt.sign(
        {id: user.id, email: user.email},
        SecretAccess,
        {expiresIn: AUTH.ACCESS_TOKEN_EXPIRY}
    )

    const refreshToken = jwt.sign(
        {id: user.id, email: user.email},
        SecretRefresh,
        {expiresIn: AUTH.REFRESH_TOKEN_EXPIRY}
    )

    await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken
    }
}

module.exports = tokenGenerate;