import { Resend } from "resend";
import { CONTACT } from "@/lib/site-config";

// The address contact-form submissions are sent to. Defaults to the
// academy's own inbox from site-config; override with CONTACT_TO_EMAIL if
// submissions should go somewhere else.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || CONTACT.email;

// Resend requires the "from" address to be on a domain you've verified in
// their dashboard. Until this project has a verified domain, it must stay
// on Resend's own onboarding@resend.dev sender — real domains will get
// rejected. Swap RESEND_FROM_EMAIL once a domain is verified.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Abu Taymeeyah Academy <onboarding@resend.dev>";

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: ContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const resend = new Resend(apiKey);

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    html: `
      <div style="font-family: sans-serif; font-size: 14px; color: #0F1E3D;">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send the email.");
  }

  return data;
}
