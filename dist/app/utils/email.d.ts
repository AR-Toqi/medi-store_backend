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
export declare const sendEmail: (options: ISendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map