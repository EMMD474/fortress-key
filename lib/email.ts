import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  react?: React.ReactElement; // for templates
  html?: string;              // for raw HTML
  text?: string;              // fallback text
}

interface SendEmailResult {
  ok: boolean;
  data?: any;
  error?: Error;
}

export async function sendEmail({ to, subject, react, html, text }: SendEmailOptions): Promise<SendEmailResult> {
  try {
    console.log(`[EMAIL] Attempting to send email to: ${to} with subject: "${subject}"`);
    
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    
    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM environment variable is not set");
    }

    const renderedHtml = react ? await render(react) : html;
    const from = process.env.EMAIL_FROM;

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html: renderedHtml,
      text: text ?? "",
    });

    console.log(`[EMAIL] Email sent successfully to ${to}:`, result);
    return { ok: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[EMAIL] Failed to send email to ${to}:`, {
      error: errorMessage,
      to,
      subject,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
