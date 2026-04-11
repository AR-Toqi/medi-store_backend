import nodemailer from 'nodemailer';
import ejs from "ejs";
import path from 'path';


interface ISendEmailOptions {
    to: string;
    subject: string;
    templateName?: string;
    templateData?: any;
    html?: string;
}

/**
 * sendEmail helper function to send emails using nodemailer and ejs templates
 */
export const sendEmail = async (options: ISendEmailOptions) => {
    const { to, subject, templateName, templateData, html: explicitHtml } = options;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.APP_USER || process.env.SMTP_USER,
            pass: process.env.APP_PASS || process.env.SMTP_PASS,
        },
    });

    let html = explicitHtml;

    if (!html && templateName) {
        const templatePath = path.join(process.cwd(), 'src', 'app', 'views', 'emails', `${templateName}.ejs`);
        html = await ejs.renderFile(templatePath, templateData);
    }

    if (!html) {
        throw new Error("Either 'html' or 'templateName' must be provided to sendEmail.");
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.APP_USER || process.env.SMTP_USER,
        to,
        subject,
        html,
    });
};