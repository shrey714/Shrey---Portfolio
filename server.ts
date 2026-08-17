import express from "express";
import { configureApplication } from "./server/_core/app.js";
import { serveStatic } from "./server/_core/ssrServer.js";

// Required root export for Vercel's Express framework detection. It mirrors
// the explicit API function so either Vercel route target receives the same
// SSR, /admin, OAuth, and tRPC application.
const app = configureApplication(express());
serveStatic(app);

export default app;
