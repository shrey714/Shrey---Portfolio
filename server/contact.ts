import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { contactRateLimits } from "../drizzle/schema.js";
import { getDb } from "./db.js";
import { ENV } from "./_core/env.js";

export const CONTACT_RATE_LIMIT_MS = 90_000;
export const TELEGRAM_TIMEOUT_MS = 8_000;

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().email("Please enter a valid email address.").max(254, "Please keep your email address under 254 characters."),
  message: z.string().trim().min(12, "Please add a little more detail to your message.").max(1_500, "Please keep your message under 1,500 characters."),
  website: z.string().max(0).optional().default(""),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export function getClientIp(resolvedIp?: string, fallbackIp?: string): string {
  return resolvedIp?.trim() || fallbackIp || "unknown";
}

export function hashNetworkKey(ip: string): string {
  return createHash("sha256").update(`${ENV.cookieSecret}:contact:${ip}`).digest("hex");
}

export function retryAfterSeconds(nextAllowedAt: Date, now = new Date()): number {
  return Math.max(1, Math.ceil((nextAllowedAt.getTime() - now.getTime()) / 1_000));
}

export async function reserveContactSubmission(ip: string, now = new Date()): Promise<number | null> {
  const db = await getDb();
  if (!db) throw new Error("Contact delivery storage is unavailable.");

  const ipHash = hashNetworkKey(ip);
  const nextAllowedAt = new Date(now.getTime() + CONTACT_RATE_LIMIT_MS);

  return db.transaction(async tx => {
    const [existing] = await tx.select().from(contactRateLimits).where(eq(contactRateLimits.ipHash, ipHash)).limit(1);

    if (existing && existing.nextAllowedAt > now) {
      return retryAfterSeconds(existing.nextAllowedAt, now);
    }

    if (existing) {
      await tx.update(contactRateLimits).set({ nextAllowedAt }).where(eq(contactRateLimits.ipHash, ipHash));
    } else {
      await tx.insert(contactRateLimits).values({ ipHash, nextAllowedAt });
    }

    return null;
  });
}

function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function formatTelegramContactMessage(input: ContactSubmission): string {
  return [
    "<b>New portfolio contact</b>",
    "",
    `<b>Name:</b> ${escapeTelegramHtml(input.name)}`,
    `<b>Email:</b> ${escapeTelegramHtml(input.email)}`,
    "",
    "<b>Message:</b>",
    escapeTelegramHtml(input.message),
  ].join("\n");
}

export function hasTelegramConfiguration(token: string, chatId: string): boolean {
  return Boolean(token.trim() && chatId.trim());
}

async function telegramRequest(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

  try {
    return await fetch(`https://api.telegram.org/bot${ENV.telegramBotToken}/${path}`, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Telegram contact delivery timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/** Establishes the upstream connection during server startup so the first visitor does not pay the warm-up cost. */
export async function warmTelegramConnection(): Promise<void> {
  if (!hasTelegramConfiguration(ENV.telegramBotToken, ENV.telegramChatId)) return;
  const response = await telegramRequest("getMe");
  if (!response.ok) throw new Error("Telegram contact connection warm-up failed.");
}

export async function deliverContactToTelegram(input: ContactSubmission): Promise<void> {
  await deliverTelegramHtmlMessage(formatTelegramContactMessage(input), "contact delivery");
}

/** Sends a trusted server-generated message to the configured private Telegram destination. */
export async function deliverTelegramHtmlMessage(text: string, purpose: string): Promise<void> {
  if (!hasTelegramConfiguration(ENV.telegramBotToken, ENV.telegramChatId)) {
    throw new Error(`Telegram ${purpose} is not configured.`);
  }

  const response = await telegramRequest("sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: ENV.telegramChatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const payload = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!response.ok || !payload?.ok) {
    throw new Error(`Telegram ${purpose} failed.`);
  }
}
