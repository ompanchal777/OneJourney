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

function escapeCsvValue(val: string | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/** Atomically write the full list back to disk as both JSON and CSV (Excel). */
function writeAll(submissions: WaitlistSubmission[]): void {
  try {
    ensureDataFile();
    
    // 1. Write JSON
    const tmpJson = DATA_FILE + ".tmp";
    fs.writeFileSync(tmpJson, JSON.stringify(submissions, null, 2), "utf-8");
    fs.renameSync(tmpJson, DATA_FILE);

    // 2. Write CSV (Excel)
    const csvPath = path.join(DATA_DIR, "waitlist.csv");
    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "College Year",
      "University",
      "Most Excited About",
      "Message",
      "Submitted On",
      "Source"
    ];
    
    const rows = [headers.join(",")];
    for (const s of submissions) {
      const row = [
        escapeCsvValue(s.id),
        escapeCsvValue(s.name),
        escapeCsvValue(s.email),
        escapeCsvValue(s.userType),
        escapeCsvValue(s.collegeYear),
        escapeCsvValue(s.university),
        escapeCsvValue(s.interestLabel),
        escapeCsvValue(s.message),
        escapeCsvValue(s.submittedAt),
        escapeCsvValue(s.source)
      ];
      rows.push(row.join(","));
    }
    
    const tmpCsv = csvPath + ".tmp";
    fs.writeFileSync(tmpCsv, rows.join("\n"), "utf-8");
    fs.renameSync(tmpCsv, csvPath);
  } catch (err) {
    console.warn("[waitlistService] Writing submissions skipped:", err);
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
    collegeYear: payload.collegeYear,
    university: payload.university,
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

  // Sync to Google Sheet via webhook if configured
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        userType: submission.userType,
        collegeYear: submission.collegeYear || "",
        university: submission.university || "",
        interest: submission.interestLabel,
        message: submission.message,
        submittedAt: submission.submittedAt,
        source: submission.source,
      }),
    }).catch((err) => {
      console.error("[waitlistService] Google Sheet sync failed:", err);
    });
  }

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

// Auto-sync existing JSON data to CSV on start-up
try {
  const existing = readAll();
  if (existing.length > 0) {
    writeAll(existing);
  }
} catch (err) {
  console.warn("[waitlistService] Auto-sync to CSV on initialization failed:", err);
}
