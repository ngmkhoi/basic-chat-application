const authModel = require("../models/auth.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {secret} = require("../config/jwt");

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

        const token = jwt.sign(
            {id: user.id, email: user.email},
            secret,
            {expiresIn: '24h'}
        )

        return {
            user: {
                id: user.id,
                email: user.email,
            },
            accessToken: token,
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

        const token = jwt.sign(
            {id: newUser.id, email: newUser.email},
            secret,
            {expiresIn: '24h'}
        )

        return {
            user: {
                id: newUser.id,
                email: newUser.email,
            },
            accessToken: token,
        }
    }
}

module.exports = new AuthService();