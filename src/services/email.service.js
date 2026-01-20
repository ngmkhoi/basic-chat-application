const transporter = require("../config/mailer")
const getVerifyEmailTemplate = require("../utils/mailFormat")

class EmailService {
    async sendVerifyEmail(email, subject, token) {
        try {
            const verifyUrl = `http://localhost:5173?token=${token}`;
            const htmlTemplate = getVerifyEmailTemplate(verifyUrl);

            const info = await transporter.sendMail({
                from: '"khoivippro123" <nguyenminhkhoi0411@gmail.com>',
                to: email,
                subject: subject,
                text: `Please verify your email by visiting: ${verifyUrl}`,
                html: htmlTemplate,
            });

            // console.log('Email sent successfully:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
