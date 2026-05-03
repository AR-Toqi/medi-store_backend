import { Resend } from 'resend';
import ejs from "ejs";
import path from 'path';

interface ISendEmailOptions {
    to: string;
    subject: string;
    templateName?: string;
    templateData?: any;
    html?: string;
}

// Initialize with your API Key from https://resend.com
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail helper function to send emails using Resend and ejs templates
 */
export const sendEmail = async (options: ISendEmailOptions) => {
    const { to, subject, templateName, templateData, html: explicitHtml } = options;

    let html = explicitHtml;

    if (!html && templateName) {
        const templatePath = path.join(process.cwd(), 'src', 'app', 'views', 'emails', `${templateName}.ejs`);
        html = await ejs.renderFile(templatePath, templateData);
    }

    if (!html) {
        throw new Error("Either 'html' or 'templateName' must be provided to sendEmail.");
    }

    const { data, error } = await resend.emails.send({
        from: process.env.SMTP_FROM || 'onboarding@resend.dev', // Use your verified domain once set up
        to: [to],
        subject,
        html,
    });

    if (error) {
        console.error("Error sending email via Resend:", error);
        throw new Error(`Error sending email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
};