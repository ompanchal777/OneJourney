/**
 * loggingService.ts
 *
 * Structured, append-only logging for email notification attempts.
 * Writes a human-readable log to logs/email_notifications.log at the project root.
 *
 * Designed to be:
 *  - Non-throwing (errors are caught internally)
 *  - Safe for concurrent async use in serverless environments
 *  - Easily replaceable with external log providers (Datadog, Logtail, etc.)
 */

import fs from "fs";
import path from "path";
import type { EmailLog } from "@/types/waitlist";

// ── Paths ─────────────────────────────────────────────────────────────────────
const LOGS_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOGS_DIR, "email_notifications.log");

/** Ensure the logs directory exists */
function ensureLogDir(): void {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
  } catch {
    // Silent — logging must never crash the application
  }
}

/**
 * Append a single structured log entry to the log file.
 *
 * Format:
 *   [2026-07-31T06:49:00.000Z] [ID: abc-123] Status: Success Provider: resend
 *   [2026-07-31T06:49:00.000Z] [ID: def-456] Status: Failed  Error: Connection refused
 */
export function logEmailAttempt(entry: EmailLog): void {
  try {
    ensureLogDir();

    const providerPart = entry.provider ? `Provider: ${entry.provider}` : "";
    const errorPart = entry.error ? `Error: ${entry.error}` : "";
    const parts = [providerPart, errorPart].filter(Boolean).join("  ");

    const line = `[${entry.timestamp}] [ID: ${entry.submissionId}] Status: ${entry.status}${parts ? "  " + parts : ""}\n`;

    fs.appendFileSync(LOG_FILE, line, "utf-8");
  } catch {
    // Silent — logging must never crash the application
  }
}

/**
 * Convenience helper to build and log a success entry.
 */
export function logEmailSuccess(
  submissionId: string,
  provider: EmailLog["provider"]
): void {
  logEmailAttempt({
    submissionId,
    timestamp: new Date().toISOString(),
    status: "Success",
    provider,
  });
}

/**
 * Convenience helper to build and log a failure entry.
 */
export function logEmailFailure(
  submissionId: string,
  error: unknown,
  provider: EmailLog["provider"] = "none"
): void {
  const errorMessage =
    error instanceof Error ? error.message : String(error ?? "Unknown error");

  logEmailAttempt({
    submissionId,
    timestamp: new Date().toISOString(),
    status: "Failed",
    provider,
    error: errorMessage,
  });
}
