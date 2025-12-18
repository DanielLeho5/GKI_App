const { google } = require("googleapis");

const gmail = google.gmail("v1");

async function sendVerificationMail(recipient, verificationUrl) {
  const auth = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  auth.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const rawMessage = Buffer.from(
    `From: Daniel Lehoczki <lehoczki.dani5@gmail.com>\r\n` +
    `To: ${recipient}\r\n` +
    `Subject: GKI App Email Verification\r\n` +
    `Content-Type: text/html; charset=utf-8\r\n\r\n` +
    `<h1>Verify Your Email for the GKI App</h1>
     <p>Click on the link below to verify your email address!</p>
     <a href="${verificationUrl}">Verify Email</a>`
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    auth,
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
}

module.exports = { sendVerificationMail };