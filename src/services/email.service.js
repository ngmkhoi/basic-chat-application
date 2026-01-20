const transporter = require("../config/mailer")
const authModel = require("../models/auth.model");
const getVerifyEmailTemplate = require("../utils/mailFormat")
const tokenGenerate = require("../helpers/generateToken");
const {ERROR_MESSAGES} = require("../config/constants");

class EmailService {
    async sendVerifyEmail(user, subject) {
        const isVerified = await authModel.isEmailVerified(user.id);
        if (isVerified) {
            throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
        }

        const { verifyEmailToken } = await tokenGenerate(user, {
            includeAccess: false,
            includeRefresh: false,
            includeVerify: true
        })

        const verifyUrl = `http://localhost:5173?token=${verifyEmailToken}`;
        const htmlTemplate = getVerifyEmailTemplate(verifyUrl);

        const info = await transporter.sendMail({
            from: '"khoivippro123" <nguyenminhkhoi0411@gmail.com>',
            to: user.email,
            subject: subject,
            text: `Please verify your email by visiting: ${verifyUrl}`,
            html: htmlTemplate,
        });
        return info;
    }
}

module.exports = new EmailService();
