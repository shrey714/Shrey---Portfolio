import express from "express";
import { configureApplication } from "./server/_core/app.js";
import { serveStatic } from "./server/_core/ssrServer.js";

const app = configureApplication(express());
serveStatic(app);

export default app;
