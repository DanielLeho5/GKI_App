const nodemailer = require("nodemailer");

/*
const {google} = require("googleapis");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })*/

async function sendVerificationMail(recipient, verificationUrl) {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Daniel Lehoczki" <lehoczki.dani5@gmail.com>',
            to: recipient,
            subject: "GKI App Email Verification",
            html: `
                <h1>Verify Your Email</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This link expires in 1 hour.</p>
            `
        })
        
        console.log(info)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendVerificationMail }