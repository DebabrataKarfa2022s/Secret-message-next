// /lib/nodemailer.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // you can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.MAIL_USERNAME, // your email address
        pass: process.env.EMAIL_APP_PASSWORD  // your email password
    }
});

export default transporter;
