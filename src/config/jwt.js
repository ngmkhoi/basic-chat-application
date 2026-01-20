const jwtConfig = {
    SecretAccess: process.env.JWT_ACCESS_TOKEN,
    SecretRefresh: process.env.JWT_REFRESH_TOKEN,
    SecretVerify: process.env.JWT_VERIFY_EMAIL_TOKEN,
}

module.exports = jwtConfig;