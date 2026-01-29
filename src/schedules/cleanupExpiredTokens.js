require('dotenv').config();
const emailService = require('../services/email.service')
const authService = require('../services/auth.service')

async function cleanupExpiredTokens() {
    const result = await authService.deleteExpiredRefreshTokens()
    await emailService.sendDeletedTokenNotification("tpfkhoi0411@gmail.com", result)
}

module.exports = cleanupExpiredTokens;