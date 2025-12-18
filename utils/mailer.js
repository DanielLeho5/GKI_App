const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationMail(recipient, verificationUrl) {
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
  });
};

module.exports = { sendVerificationMail }