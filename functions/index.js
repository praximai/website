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
const cors = require('cors');

const corsMiddleware = cors({
  origin: 'https://www.praxim.ai',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
});

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

exports.sendEmail = functions.https.onRequest((req, res) => {
  const { fullName, email, phone, message } = req.body;
  const mailOptions = {
    from: email,
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
      res.status(500).send(error.toString());
    } else {
      res.status(200).send('Email sent: ' + info.response);
    }
  });
});
