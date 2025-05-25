import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"Fleet Guard" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  })
}