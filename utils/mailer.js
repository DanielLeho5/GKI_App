const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

async function sendVerificationMail(recipient, verificationUrl) {
    try {

        const accesToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "oauth2",
                user: "lehoczki.dani5@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accesToken
            }
        })

        const mailOptions = {
            from: 'Daniel Lehoczki <lehoczki.dani5@gmail.com>',
            to: recipient,
            subject: "GKI App Email Verification",
            text: "Verify Your Email for you GKI App",
            html: `
                <h1>Verify Your Email for you GKI App</h1>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This link expires in 1 hour.</p>
            `
        }

        const info = await transport.sendMail(mailOptions)

        //console.log(inf)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendVerificationMail }