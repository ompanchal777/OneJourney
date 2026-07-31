/**
 * POST /api/waitlist
 *
 * Receives waitlist form submissions from the frontend.
 *
 * Flow:
 *  1. Validate payload (server-side)
 *  2. Save to local JSON store via waitlistService
 *  3. Send admin notification email via emailService (asynchronous, non-blocking for UI)
 *  4. Log the email attempt via loggingService
 *  5. Return a structured response to the frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "@/services/waitlistService";
import { sendWaitlistAdminNotification } from "@/services/emailService";
import { logEmailSuccess, logEmailFailure } from "@/services/loggingService";
import type { WaitlistPayload, WaitlistApiResponse, WaitlistSubmission } from "@/types/waitlist";

// ── Validation ────────────────────────────────────────────────────────────────

function validatePayload(body: unknown): { valid: true; data: WaitlistPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const b = body as Record<string, unknown>;

  if (!b.name || typeof b.name !== "string" || !b.name.trim()) {
    return { valid: false, error: "Full Name is required." };
  }

  if (!b.email || typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    return { valid: false, error: "A valid Email Address is required." };
  }

  if (!b.userType || typeof b.userType !== "string") {
    return { valid: false, error: "User role is required." };
  }

  if (!b.interest || typeof b.interest !== "string") {
    return { valid: false, error: "Interest selection is required." };
  }

  return {
    valid: true,
    data: {
      name: b.name as string,
      email: b.email as string,
      userType: b.userType as string,
      interest: b.interest as string,
      interestLabel: (b.interestLabel as string) || b.interest as string,
      message: typeof b.message === "string" ? b.message : "",
    },
  };
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<WaitlistApiResponse>> {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  // ── 2. Validate ────────────────────────────────────────────────────────────
  const validation = validatePayload(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  const payload = validation.data;

  // ── 3. Save submission ─────────────────────────────────────────────────────
  let submissionId: string;
  try {
    submissionId = await saveSubmission(payload);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save submission.";
    console.error("[api/waitlist] Save failed:", msg);
    return NextResponse.json(
      { success: false, error: "Failed to save your submission. Please try again." },
      { status: 500 }
    );
  }

  // ── 4. Build full submission object for the email ──────────────────────────
  const submission: WaitlistSubmission = {
    id: submissionId,
    name: payload.name,
    email: payload.email,
    userType: payload.userType,
    interest: payload.interest,
    interestLabel: payload.interestLabel,
    message: payload.message,
    submittedAt: new Date().toISOString(),
    source: "OneJourney Landing Page",
  };

  // ── 5. Send email notification (non-blocking — we still return success
  //       even if the email fails, since the data is already saved) ───────────
  try {
    const emailResult = await sendWaitlistAdminNotification(submission);

    if (emailResult.success) {
      logEmailSuccess(submissionId, emailResult.provider);
      return NextResponse.json({ success: true, submissionId }, { status: 200 });
    } else {
      // Email failed — but submission was saved
      logEmailFailure(submissionId, emailResult.error, emailResult.provider);
      return NextResponse.json(
        {
          success: true,
          submissionId,
          emailError: true,
          emailErrorMessage: emailResult.error,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    // Unexpected error in email path — data still saved, don't fail the user
    const msg = err instanceof Error ? err.message : String(err);
    logEmailFailure(submissionId, msg, "none");
    console.error("[api/waitlist] Unexpected email error:", msg);

    return NextResponse.json(
      {
        success: true,
        submissionId,
        emailError: true,
        emailErrorMessage: "Unexpected error during email notification.",
      },
      { status: 200 }
    );
  }
}

// Reject other HTTP methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
