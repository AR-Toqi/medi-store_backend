import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
} as SMTPTransport.Options);
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: true
  }, 
  trustedOrigins: [
    process.env.APP_URL!
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) =>{
        try {
          const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
          const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
    <tr>
      <td align="center">

        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:24px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; color:#111827;">MediStore 💊</h1>
              <p style="margin:4px 0 0; color:#6b7280;">Your Trusted Online Medicine Shop</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="color:#374151; font-size:16px; line-height:1.6;">
              <p>Hello 👋 ${user.name}</p>

              <p>
                Thank you for signing up for <strong>MediStore</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <p style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                   style="
                     background-color:#16a34a;
                     color:#ffffff;
                     padding:12px 24px;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:bold;
                     display:inline-block;
                   ">
                  Verify Email
                </a>
              </p>

              <p>
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; color:#2563eb;">
                ${verificationUrl}
              </p>

              <p>
                If you didn’t create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:30px; text-align:center; font-size:12px; color:#9ca3af;">
              <p style="margin:0;">© ${new Date().getFullYear()} MediStore. All rights reserved.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
    const info = await transporter.sendMail({
    from: '"Your APP" <${process.env.SMTP_FROM}>',
    to: user.email,
    subject: "Plz verify your email !",
    text: "Hello world?", // Plain-text version of the message
    html: html, // HTML version of the message
  });

  console.log(" Verification email sent successfully:", info.messageId);
        } catch (error) {
          console.error(" Failed to send verification email:", error);
          throw error;
        }
    }
  }

});