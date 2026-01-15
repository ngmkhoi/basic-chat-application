const authModel = require("../models/auth.model");
const refreshTokenModel = require("../models/refreshToken.model");
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT_ROUNDS;
const jwt = require('jsonwebtoken');
const {SecretRefresh} = require("../config/jwt");
const tokenGenerate = require("../helpers/generateToken");

const expiresAt = new Date(Date.now() + 30*24*60*60*1000);

class AuthService {
    async login({ email, password }) {
        const user = await authModel.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const {accessToken, refreshToken} = await tokenGenerate(user, expiresAt);

        return {
            user: {
                id: user.id,
                email: user.email,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }
    async register(payload) {
        const existingUser = await authModel.checkEmailExists(payload.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

        const newUser = await authModel.createUser({
            email: payload.email,
            password: hashedPassword,
            full_name: payload.full_name,
        })

        const {accessToken, refreshToken} = await tokenGenerate(newUser, expiresAt);

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
        }
    }
    async createNewToken(refreshToken) {
        let decoded;

        const tokenInDB = await refreshTokenModel.findByToken(refreshToken);
        if (!tokenInDB) {
            throw new Error('Invalid refresh token');
        }

        try {
            decoded = jwt.verify(refreshToken, SecretRefresh)
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token expired');
            }
            throw new Error('Invalid refresh token');
        }

        const user = { id: decoded.id, email: decoded.email }

        const {accessToken, newRefreshToken} = await tokenGenerate(user, expiresAt);
        await refreshTokenModel.revokeToken(refreshToken);

        return {
            user: {
                id: decoded.id,
                email: decoded.email,
            },
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        }
    }
    async logoutUser(refreshToken) {
        const tokenInDB = await refreshTokenModel.findByToken(refreshToken);
        if (!tokenInDB) {
            throw new Error('Invalid refresh token');
        }

        const success = await refreshTokenModel.revokeToken(refreshToken);
        if(!success) {
            throw new Error('Failed to logout');
        }
        return { message: 'Logged out successfully' };
    }
}

module.exports = new AuthService();