import type { Express, Request, Response } from "express";
import { contactSubmissionSchema, deliverContactToTelegram, getClientIp, reserveContactSubmission } from "./contact.js";

function sendJsonError(res: Response, status: number, message: string) {
  return res.status(status).json({ accepted: false, message });
}

export function registerContactApi(app: Express) {
  app.post("/api/contact", async (req: Request, res: Response) => {
    const parsed = contactSubmissionSchema.safeParse(req.body);
    if (!parsed.success) return sendJsonError(res, 400, parsed.error.issues[0]?.message ?? "Please check your message and try again.");

    const input = parsed.data;
    // Honeypot submissions receive a generic success response and never reach Telegram.
    if (input.website) return res.status(202).json({ accepted: true, blocked: true });

    const requestStartedAt = performance.now();
    const rateLimitStartedAt = performance.now();
    let retryAfter: number | null;
    try {
      retryAfter = await reserveContactSubmission(getClientIp(req.ip, req.socket.remoteAddress));
    } catch {
      return sendJsonError(res, 503, "Contact delivery storage is unavailable. Please try again shortly or use the email link.");
    }
    const rateLimitDuration = performance.now() - rateLimitStartedAt;

    if (retryAfter) {
      res.set({ "Retry-After": String(retryAfter), "Server-Timing": `rate-limit;dur=${rateLimitDuration.toFixed(1)}` });
      return sendJsonError(res, 429, `Please wait ${retryAfter} seconds before sending another message.`);
    }

    try {
      const telegramStartedAt = performance.now();
      await deliverContactToTelegram(input);
      const telegramDuration = performance.now() - telegramStartedAt;
      const totalDuration = performance.now() - requestStartedAt;
      res.set("Server-Timing", `rate-limit;dur=${rateLimitDuration.toFixed(1)}, telegram;dur=${telegramDuration.toFixed(1)}, total;dur=${totalDuration.toFixed(1)}`);
      console.info("[Contact] Delivery timing", { rateLimitMs: Math.round(rateLimitDuration), telegramMs: Math.round(telegramDuration), totalMs: Math.round(totalDuration) });
      return res.status(202).json({ accepted: true, blocked: false });
    } catch (error) {
      console.error("[Contact] Telegram delivery failed", { error: error instanceof Error ? error.message : "unknown" });
      return sendJsonError(res, 503, "Your message could not be sent right now. Please try again shortly or use the email link.");
    }
  });
}
