const transporter = require("../config/mailer")
const authModel = require("../models/auth.model");
const getVerifyEmailTemplate = require("../utils/mailFormat")
const getPasswordChangeEmailTemplate = require("../utils/passwordChangeEmailTemplate");
const getDailyReportEmailTemplate = require("../utils/dailyReportEmailTemplate");
const getBackupNotificationEmailTemplate = require("../utils/backupNotificationEmailTemplate");
const getTokenCleanupEmailTemplate = require("../utils/tokenCleanupEmailTemplate");
const getJobCleanupEmailTemplate = require("../utils/jobCleanupEmailTemplate");
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
        const verifyEmailHTMLTemplate = getVerifyEmailTemplate(verifyUrl);

        const info = await transporter.sendMail({
            from: '"khoivippro123" <nguyenminhkhoi0411@gmail.com>',
            to: user.email,
            subject: subject,
            text: `Please verify your email by visiting: ${verifyUrl}`,
            html: verifyEmailHTMLTemplate,
        });
        return info;
    }

    async sendPasswordChangeEmail(user, time) {
        const passwordChangeHTMLTemplate = getPasswordChangeEmailTemplate(time);

        const info = await transporter.sendMail({
            from: '"khoivippro123" <nguyenminhkhoi0411@gmail.com>',
            to: user.email,
            subject: "Password Changed Successfully",
            text: `Your password was changed successfully at ${time}.`,
            html: passwordChangeHTMLTemplate,
        });
        return info;
    }

    async sendNewUserDailyReport(user, email) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const reportDate = currentDate.toISOString().slice(0, 10);

        const dailyReportHTMLTemplate = getDailyReportEmailTemplate(user, reportDate);

        const info = await transporter.sendMail({
            from: '"khoivippro123" <nguyenminhkhoi0411@gmail.com>',
            to: email,
            subject: "Daily Report",
            text: `There are ${user} new users at ${reportDate}.`,
            html: dailyReportHTMLTemplate,
        });
        return info;
    }

    async sendBackupNotification(adminEmail, backupData) {
        const { status, fileName } = backupData;
        console.log(backupData)
        const subject = status === 'SUCCESS'
                  ? `✅ [Backup Success] Database Backup: ${fileName}`
                  : `❌ [Backup Failed] Database Backup Alert`;

        const htmlTemplate = getBackupNotificationEmailTemplate(backupData);

        const info = await transporter.sendMail({
            from: '"System Backup" <nguyenminhkhoi0411@gmail.com>',
            to: adminEmail,
            subject: subject,
            html: htmlTemplate,
        });
        return info;
    }

    async sendDeletedTokenNotification(email, data) {
        const { status, deletedCount } = data;
        const subject = status === 'SUCCESS'
            ? `✅ [Cleanup Success] Token Cleanup: ${deletedCount} tokens removed`
            : `❌ [Cleanup Failed] Token Cleanup Alert`;

        const htmlTemplate = getTokenCleanupEmailTemplate(data);

        const info = await transporter.sendMail({
            from: '"System Cleanup" <nguyenminhkhoi0411@gmail.com>',
            to: email,
            subject: subject,
            html: htmlTemplate,
        });
        return info;
    }

    async sendDeletedJobNotification(email, data) {
        const { status, deletedCount } = data;
        const subject = status === 'SUCCESS'
            ? `✅ [Job Cleanup] Removed ${deletedCount} Completed Jobs`
            : `❌ [Job Cleanup Failed] System Alert`;

        const htmlTemplate = getJobCleanupEmailTemplate(data);

        const info = await transporter.sendMail({
            from: '"Queue Manager" <nguyenminhkhoi0411@gmail.com>',
            to: email,
            subject: subject,
            html: htmlTemplate,
        });
        return info;
    }
}

module.exports = new EmailService();
