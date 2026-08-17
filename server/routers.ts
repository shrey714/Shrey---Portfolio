import { COOKIE_NAME } from "../shared/const.js";
import { TRPCError } from "@trpc/server";
import { contactSubmissionSchema, deliverContactToTelegram, getClientIp, reserveContactSubmission } from "./contact.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, router } from "./_core/trpc.js";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  contact: router({
    submit: publicProcedure.input(contactSubmissionSchema).mutation(async ({ ctx, input }) => {
      const requestStartedAt = performance.now();
      // Honeypot submissions receive a generic success response and never reach Telegram.
      if (input.website) return { accepted: true, blocked: true } as const;

      const ip = getClientIp(ctx.req.ip, ctx.req.socket.remoteAddress);
      const rateLimitStartedAt = performance.now();
      const retryAfter = await reserveContactSubmission(ip);
      const rateLimitDuration = performance.now() - rateLimitStartedAt;
      if (retryAfter) {
        ctx.res.setHeader("Server-Timing", `rate-limit;dur=${rateLimitDuration.toFixed(1)}`);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Please wait ${retryAfter} seconds before sending another message.`,
        });
      }

      try {
        const telegramStartedAt = performance.now();
        await deliverContactToTelegram(input);
        const telegramDuration = performance.now() - telegramStartedAt;
        const totalDuration = performance.now() - requestStartedAt;
        ctx.res.setHeader("Server-Timing", `rate-limit;dur=${rateLimitDuration.toFixed(1)}, telegram;dur=${telegramDuration.toFixed(1)}, total;dur=${totalDuration.toFixed(1)}`);
        console.info("[Contact] Delivery timing", { rateLimitMs: Math.round(rateLimitDuration), telegramMs: Math.round(telegramDuration), totalMs: Math.round(totalDuration) });
      } catch (error) {
        console.error("[Contact] Telegram delivery failed", { error: error instanceof Error ? error.message : "unknown" });
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Your message could not be sent right now. Please try again shortly or use the email link." });
      }

      return { accepted: true, blocked: false } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
