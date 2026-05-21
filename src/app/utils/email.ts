import ejs from "ejs";
import status from 'http-status';
import path from 'path';
import { BrevoClient } from '@getbrevo/brevo';
import fs from "fs";
import AppError from "../errors/AppError.js";

// Initialize with your API Key
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

export interface ISendEmailOptions {
    to: string;
    subject: string;
    templateName?: string;
    templateData?: Record<string, any>;
    html?: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    html: explicitHtml,
    attachments,
}: ISendEmailOptions) => {
    try {
        let finalHtml = explicitHtml;

        if (!finalHtml && templateName) {
            // ── Resolve template path ─────────────────────────────────────
            const builtPath = path.resolve(process.cwd(), "dist/src/app/views/emails", `${templateName}.ejs`);
            const sourcePath = path.resolve(process.cwd(), "src/app/views/emails", `${templateName}.ejs`);
            const currentFileDir = __dirname;
            const relativeTemplatePath = path.resolve(currentFileDir, "../views/emails", `${templateName}.ejs`);

            let templatePath = "";
            if (fs.existsSync(builtPath)) templatePath = builtPath;
            else if (fs.existsSync(sourcePath)) templatePath = sourcePath;
            else if (fs.existsSync(relativeTemplatePath)) templatePath = relativeTemplatePath;

            if (!templatePath) {
                throw new AppError(status.INTERNAL_SERVER_ERROR, `Email template ${templateName} not found`);
            }

            finalHtml = await ejs.renderFile(templatePath, templateData);
        }

        if (!finalHtml) {
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Either 'html' or 'templateName' must be provided to sendEmail");
        }

        // ── Send via Brevo ────────────────────────────────────────────
        await brevo.transactionalEmails.sendTransacEmail({
            subject,
            htmlContent: finalHtml,
            sender: {
                name: process.env.BREVO_FROM_NAME as string,
                email: process.env.BREVO_FROM_EMAIL as string,
            },
            to: [{ email: to }],
            ...(attachments?.length && {
                attachment: attachments.map((a) => ({
                    name: a.filename,
                    content: Buffer.isBuffer(a.content)
                        ? a.content.toString('base64')
                        : Buffer.from(a.content as string).toString('base64'),
                })),
            }),
        });

    } catch (error: any) {
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
};