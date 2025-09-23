// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      text: text || "",
      html: html || "",
    });
    return { success: true, result };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}
