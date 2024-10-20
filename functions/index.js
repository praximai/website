/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const HttpsError = functions.https.HttpsError;
const onCall = functions.https.onCall;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.porkbun.com',
  port: 587,
  secure: false,
  auth: {
    user: 'business@praxim.ai', 
    pass: 'dropoutspring25',
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

exports.sendEmail = onCall(async (data, context) => {
  const fullName = data.fullName;
  const email = data.email;
  const phone = data.phone;
  const message = data.message;
  logger.info("Received full name:", fullName);
  logger.info("Received email:", email);
  const mailOptions = {
    from: 'business@praxim.ai',
    to: "business@praxim.ai",
    subject: `Contact Form Submission from ${fullName}`,
    text: `You have a new message from your website contact form:
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      Message:
      ${message}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new HttpsError("unknown", error.message, error);
    }
  });
});
