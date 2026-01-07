import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
});

export const sendEmail = async (email, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"TaskHub" <${process.env.MAIL_FROM}>`, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
            //   text: body, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true
    } catch (err) {
        console.error("Error while sending mail", err);
        return false
    }
}