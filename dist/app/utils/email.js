"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
/**
 * sendEmail helper function to send emails using nodemailer and ejs templates
 */
const sendEmail = async (options) => {
    const { to, subject, templateName, templateData, html: explicitHtml } = options;
    const transporter = nodemailer_1.default.createTransport({
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
        const templatePath = path_1.default.join(process.cwd(), 'src', 'app', 'views', 'emails', `${templateName}.ejs`);
        html = await ejs_1.default.renderFile(templatePath, templateData);
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
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map