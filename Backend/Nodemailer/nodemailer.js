import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  port: 587,
  host: "smtp-relay.brevo.com",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transport;
