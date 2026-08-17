import express from "express";
import { configureApplication } from "../server/_core/app.js";

// Vercel maps /api/* requests to this Express application. The public SSR
// entry remains server.ts; this function keeps tRPC and OAuth endpoints out
// of Vercel's reserved API-route 404 behavior.
const app = configureApplication(express());

export default app;
