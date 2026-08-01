/**
 * Shared TypeScript types for the OneJourney waitlist system.
 * Used by the API route, services, and the frontend modal.
 */

export interface WaitlistSubmission {
  /** Auto-generated UUID */
  id: string;

  /** User-entered full name */
  name: string;

  /** User-entered email address */
  email: string;

  /** Selected role: Student | Teacher | Mentor | Parent */
  userType: string;

  /** Selected interest card ID */
  interest: string;

  /** Human-readable label for the selected interest */
  interestLabel: string;

  /** Optional free-text message from the user */
  message: string;

  /** ISO 8601 timestamp of submission */
  submittedAt: string;

  /** Source page identifier */
  source: string;

  /** College Year (optional, students only) */
  collegeYear?: string;

  /** University (optional, students only) */
  university?: string;
}

export interface EmailLog {
  /** Matches the WaitlistSubmission id */
  submissionId: string;

  /** ISO 8601 timestamp of the email attempt */
  timestamp: string;

  /** "Success" | "Failed" */
  status: "Success" | "Failed";

  /** Error message, if any */
  error?: string;

  /** Which provider was used */
  provider?: "resend" | "smtp" | "none";
}

/** Payload sent from the frontend modal to /api/waitlist */
export interface WaitlistPayload {
  name: string;
  email: string;
  userType: string;
  interest: string;
  interestLabel: string;
  message: string;
  collegeYear?: string;
  university?: string;
}

/** Response shape returned by /api/waitlist */
export interface WaitlistApiResponse {
  success: boolean;
  submissionId?: string;
  /** True if saving succeeded but email failed */
  emailError?: boolean;
  emailErrorMessage?: string;
  error?: string;
}
