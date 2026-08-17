import express from "express";
import { configureApplication } from "../server/_core/app.js";
import { serveStatic } from "../server/_core/ssrServer.js";

// The Vercel function entrypoint. Rewrites preserve the incoming URL, so the
// Express application receives /, /admin, and /api/trpc/* at their original paths.
const app = configureApplication(express());
serveStatic(app);

export default app;
