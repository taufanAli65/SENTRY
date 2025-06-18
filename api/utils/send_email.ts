import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { AppError } from "./app_error";
import { emailConfig } from "../config/email_sender";

interface SendEmailParams {
  to: string;
  subject: string;
  templateName: string;
  context: Record<string, any>;
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  context,
}: SendEmailParams): Promise<Error | void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
      },
    });

    const templatePath = path.join(
      __dirname,
      "..",
      "email_templates",
      `${templateName}.hbs`
    );
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(context);

    await transporter.sendMail({
      from: `"Data Sentry Owner" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw AppError("Failed to send email", 500);
  }
};
