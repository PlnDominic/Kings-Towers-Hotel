import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Mail is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS (see .env.example)."
    );
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

const HOTEL_MAIL_TO = process.env.MAIL_TO || "kingstowershotel@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER;

export async function sendMail({ subject, text, html, replyTo, to = HOTEL_MAIL_TO }) {
  const transport = getTransporter();
  await transport.sendMail({
    from: MAIL_FROM,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}
