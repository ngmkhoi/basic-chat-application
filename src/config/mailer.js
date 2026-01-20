const nodemailer = require('nodemailer');

const googleTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});

module.exports = googleTransporter;
