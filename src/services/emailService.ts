/**
 * emailService.ts
 *
 * Independent, modular email notification service for OneJourney.
 *
 * Provider priority:
 *   1. Resend HTTP API  (if RESEND_API_KEY is set)
 *   2. Nodemailer SMTP  (if SMTP_USER + SMTP_PASS are set)
 *   3. Console-only dev fallback (no credentials set)
 *
 * This service is intentionally provider-agnostic so it can later support:
 *  - Welcome emails to users
 *  - Beta launch invitations
 *  - Feature update newsletters
 *  - Event announcements
 *
 * Runs ONLY on the server (inside Next.js API routes / Server Actions).
 */

import type { WaitlistSubmission } from "@/types/waitlist";

// ── Env helpers ───────────────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "OneJourney <notifications@resend.dev>";
const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "";

// ── Email Template ────────────────────────────────────────────────────────────

function buildEmailBody(submission: WaitlistSubmission): {
  html: string;
  text: string;
} {
  const timestamp = new Date(submission.submittedAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let text = `
A new user has joined the OneJourney waitlist.

────────────────────────────────────────────

👤 Full Name:
${submission.name}

📧 Email:
${submission.email}

🎓 Role:
${submission.userType}
`.trim();

  if (submission.collegeYear) {
    text += `\n\n📅 College Year:\n${submission.collegeYear}`;
  }
  if (submission.university) {
    text += `\n\n🏫 University:\n${submission.university}`;
  }

  text += `\n\n⭐ Most Excited About:\n${submission.interestLabel}

💬 Message:\n${submission.message || "(none)"}

🕒 Submitted On:\n${timestamp} (IST)

🌐 Source:\n${submission.source}

🔑 Submission ID:\n${submission.id}

────────────────────────────────────────────
`;

  const fields = [
    ["👤 Full Name", submission.name],
    ["📧 Email", `<a href="mailto:${submission.email}" style="color:#0077FF;text-decoration:none;">${submission.email}</a>`],
    ["🎓 Role", submission.userType],
  ];

  if (submission.collegeYear) {
    fields.push(["📅 College Year", submission.collegeYear]);
  }
  if (submission.university) {
    fields.push(["🏫 University", submission.university]);
  }

  fields.push(
    ["⭐ Most Excited About", submission.interestLabel],
    ["💬 Message", submission.message || "<em style='color:#94a3b8;'>No message provided</em>"],
    ["🕒 Submitted On", `${timestamp} (IST)`],
    ["🌐 Source", submission.source],
    ["🔑 Submission ID", `<code style="font-family:monospace;font-size:12px;background:#e8edf5;padding:2px 6px;border-radius:4px;">${submission.id}</code>`]
  );

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New OneJourney Waitlist Submission</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f7faff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;border:1px solid #e8edf5;overflow:hidden;box-shadow:0 8px 32px rgba(10,37,64,0.10);">

          <!-- Header bar -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#0077FF,#3399ff,#0077FF);"></td>
          </tr>

          <!-- Logo row -->
          <tr>
            <td style="padding:32px 40px 0;text-align:left;">
              <span style="font-size:18px;font-weight:700;color:#0A2540;letter-spacing:-0.3px;">
                One<span style="color:#0077FF;">Journey</span>
              </span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:20px 40px 4px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#0A2540;line-height:1.3;">
                🎉 New Waitlist Submission
              </h1>
              <p style="margin:8px 0 0;font-size:14px;color:#64748b;">
                A new user has joined the OneJourney early access community.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:20px 40px;">
              <hr style="border:none;border-top:1px solid #e8edf5;margin:0;" />
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faff;border-radius:14px;border:1px solid #e8edf5;">
                <tr><td style="padding:24px;">

                  ${fields.map(([label, value]) => `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                      <tr>
                        <td style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;padding-bottom:4px;">${label}</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;font-weight:500;color:#0A2540;">${value}</td>
                      </tr>
                    </table>
                  `).join("")}

                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">
                This is an automated notification from OneJourney. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { html, text };
}

// ── Provider: Resend ──────────────────────────────────────────────────────────

async function sendViaResend(
  submission: WaitlistSubmission
): Promise<void> {
  const { html, text } = buildEmailBody(submission);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [NOTIFICATION_EMAIL],
      subject: "New OneJourney Waitlist Submission",
      html,
      text,
      tags: [
        { name: "type", value: "waitlist-admin-notification" },
        { name: "submission_id", value: submission.id },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown");
    throw new Error(`Resend API error ${response.status}: ${errorBody}`);
  }

  console.log(`[emailService] Email sent via Resend for submission ${submission.id}`);
}

// ── Provider: SMTP (Nodemailer) ───────────────────────────────────────────────

async function sendViaSmtp(
  submission: WaitlistSubmission
): Promise<void> {
  // Use eval() trick to prevent Next.js from statically analyzing this import.
  // If nodemailer is not installed this will throw a clear error message.
  // eslint-disable-next-line no-new-func
  const requireDynamic = new Function("moduleName", "return import(moduleName)");

  let nodemailer: typeof import("nodemailer");
  try {
    nodemailer = await requireDynamic("nodemailer");
  } catch {
    throw new Error(
      "nodemailer is not installed. Run: npm install nodemailer  to use SMTP email sending."
    );
  }

  const { html, text } = buildEmailBody(submission);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: SMTP_FROM,
    to: NOTIFICATION_EMAIL,
    subject: "New OneJourney Waitlist Submission",
    html,
    text,
  });

  console.log(`[emailService] Email sent via SMTP for submission ${submission.id}`);
}

// ── Public API ────────────────────────────────────────────────────────────────

export type EmailProvider = "resend" | "smtp" | "none";

export interface SendEmailResult {
  success: boolean;
  provider: EmailProvider;
  error?: string;
}

/**
 * Send the admin notification email for a waitlist submission.
 *
 * Tries providers in priority order:
 *   Resend → SMTP → console-only (dev fallback)
 *
 * Never throws — always returns a result object.
 */
export async function sendWaitlistAdminNotification(
  submission: WaitlistSubmission
): Promise<SendEmailResult> {
  if (!NOTIFICATION_EMAIL) {
    console.warn(
      "[emailService] NOTIFICATION_EMAIL is not configured. Skipping email."
    );
    return {
      success: false,
      provider: "none",
      error: "NOTIFICATION_EMAIL environment variable is not set.",
    };
  }

  // ── Try Resend first ───────────────────────────────────────────────────────
  if (RESEND_API_KEY && !RESEND_API_KEY.startsWith("re_your")) {
    try {
      await sendViaResend(submission);
      return { success: true, provider: "resend" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[emailService] Resend failed: ${msg}`);
      // Fall through to SMTP
    }
  }

  // ── Try SMTP second ────────────────────────────────────────────────────────
  if (SMTP_USER && SMTP_PASS && !SMTP_PASS.startsWith("your-16")) {
    try {
      await sendViaSmtp(submission);
      return { success: true, provider: "smtp" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[emailService] SMTP failed: ${msg}`);
      return { success: false, provider: "smtp", error: msg };
    }
  }

  // ── Dev fallback — just log the email body ─────────────────────────────────
  const { text } = buildEmailBody(submission);
  console.log(
    "\n[emailService] ⚠️  No email provider configured.\n" +
      "Configure RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env.local.\n" +
      "Email that would have been sent:\n\n" +
      text +
      "\n"
  );

  return {
    success: false,
    provider: "none",
    error:
      "No email provider configured. Set RESEND_API_KEY or SMTP credentials in .env.local.",
  };
}

/**
 * Extensible hook for future email types.
 * Placeholder — implement as needed for:
 *  - sendWelcomeEmail(submission)
 *  - sendBetaInvitation(email, name)
 *  - sendNewsletter(emails, content)
 */
export async function sendWelcomeEmail(): Promise<SendEmailResult> {
  // TODO: Implement welcome email to the user
  console.log("[emailService] sendWelcomeEmail — not yet implemented.");
  return { success: false, provider: "none", error: "Not implemented" };
}
