import express from "express";
import { configureApplication } from "./server/_core/app";
import { serveStatic } from "./server/_core/ssrServer";

const app = configureApplication(express());
serveStatic(app);

export default app;
