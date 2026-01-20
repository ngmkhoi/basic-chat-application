const jwt = require("jsonwebtoken");
const {SecretAccess, SecretRefresh, SecretVerify} = require("../config/jwt");
const { AUTH } = require("../config/constants");

const tokenGenerate = async (user, options = { includeAccess: true, includeRefresh: true, includeVerify: true }) => {
    const tokens = {};

    if (options.includeAccess) {
        tokens.accessToken = jwt.sign(
            {id: user.id, email: user.email},
            SecretAccess,
            {expiresIn: AUTH.ACCESS_TOKEN_EXPIRY}
        );
    }

    if (options.includeRefresh) {
        tokens.refreshToken = jwt.sign(
            {id: user.id, email: user.email},
            SecretRefresh,
            {expiresIn: AUTH.REFRESH_TOKEN_EXPIRY}
        );
    }

    if (options.includeVerify) {
        tokens.verifyEmailToken = jwt.sign(
            {id: user.id, email: user.email},
            SecretVerify,
            {expiresIn: AUTH.VERIFY_TOKEN_EXPIRY}
        );
    }

    return tokens;
}

module.exports = tokenGenerate;