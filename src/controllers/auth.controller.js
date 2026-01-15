const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({email, password});

        if (!result) {
            return res.error(401, 'Invalid email or password')
        }

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict'
        });

        res.success({
            user: result.user,
            accessToken: result.accessToken,
        }, 200);
    } catch (error) {
        if (error.message === 'Invalid email or password') {
            return res.error(401, 'Invalid email or password');
        }
        res.error(500, error.message);
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;
        const result = await authService.register({ email, password, full_name });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict'
        });

        res.success({
            user: result.user,
            accessToken: result.accessToken,
        }, 201);
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.error(409, error.message);
        }
        res.error(500, 'Internal server error');
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.error(401, 'Refresh token required');
        }
        const result = await authService.createNewToken(refreshToken);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'strict'
        });

        res.success({
            user: result.user,
            accessToken: result.accessToken
        }, 200);
    } catch (error) {
        if (error.message.includes('Invalid') || error.message.includes('expired')) {
            return res.error(403, error.message);
        }
        res.error(500, 'Internal server error');
    }
}

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.error(401, 'Refresh token required');
        }
        const result = await authService.logoutUser(refreshToken);
        res.success(result, 200);
        res.clearCookie('refreshToken');
    } catch (error) {
        res.error(500, error.message);
    }
}
module.exports = {
    login,
    createUser,
    refreshToken,
    logout,
}
