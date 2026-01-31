import nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export async function sendMail(options: SendMailOptions) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@medistore.com',
    ...options,
  });
}
