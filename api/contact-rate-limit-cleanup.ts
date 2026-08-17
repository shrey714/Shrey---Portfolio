import type { Request, Response } from "express";
import { runContactRateLimitCleanup } from "../server/scheduledCleanup";

/** Vercel Function entry point for the once-daily expired-rate-limit cleanup. */
export default async function contactRateLimitCleanup(req: Request, res: Response): Promise<void> {
  await runContactRateLimitCleanup(req, res);
}
