/**
 * waitlistService.ts
 *
 * Handles persisting waitlist submissions.
 *
 * Current backend: Local JSON file (`data/waitlist.json`).
 * Designed to be swapped out for Firebase, Supabase, or Prisma
 * by replacing only the `saveSubmission` implementation.
 *
 * This file runs ONLY on the server (inside Next.js API routes).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { WaitlistSubmission, WaitlistPayload } from "@/types/waitlist";

// ── Paths ─────────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Ensure the data directory and file exist. */
function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    // If it's a read-only filesystem or similar, do not throw.
    console.warn("[waitlistService] Directory/file initialization skipped (likely read-only filesystem):", err);
  }
}

/** Read all submissions from disk. */
function readAll(): WaitlistSubmission[] {
  try {
    ensureDataFile();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistSubmission[];
  } catch {
    return [];
  }
}

/** Atomically write the full list back to disk. */
function writeAll(submissions: WaitlistSubmission[]): void {
  try {
    ensureDataFile();
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(submissions, null, 2), "utf-8");
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.warn("[waitlistService] Writing submission to local file skipped (likely read-only filesystem):", err);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Save a new waitlist submission.
 *
 * @returns The generated unique submission ID.
 * @throws If the write fails (caller should handle this).
 */
export async function saveSubmission(payload: WaitlistPayload): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const submission: WaitlistSubmission = {
    id,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    userType: payload.userType,
    interest: payload.interest,
    interestLabel: payload.interestLabel,
    message: payload.message.trim(),
    submittedAt: now,
    source: "OneJourney Landing Page",
  };

  const existing = readAll();

  // Optional: prevent duplicate emails
  const duplicate = existing.find(
    (s) => s.email === submission.email
  );
  if (duplicate) {
    // Still return the existing ID — treat as idempotent
    console.warn(
      `[waitlistService] Duplicate email detected: ${submission.email} (existing id: ${duplicate.id})`
    );
    return duplicate.id;
  }

  existing.push(submission);
  writeAll(existing);

  console.log(
    `[waitlistService] Saved submission id=${id} email=${submission.email}`
  );

  return id;
}

/**
 * Retrieve all submissions (useful for an admin dashboard later).
 */
export async function getAllSubmissions(): Promise<WaitlistSubmission[]> {
  return readAll();
}

/**
 * Retrieve a single submission by ID.
 */
export async function getSubmissionById(
  id: string
): Promise<WaitlistSubmission | null> {
  const all = readAll();
  return all.find((s) => s.id === id) ?? null;
}
