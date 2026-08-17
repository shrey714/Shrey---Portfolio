import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { composeHtml } from "./ssr.js";

type SsrEntry = {
  render: (url: string) => Promise<import("../../client/src/entry-server.js").RenderResult>;
};

function firstExistingPath(paths: string[], requiredFile?: string) {
  return paths.find(candidate => fs.existsSync(requiredFile ? path.resolve(candidate, requiredFile) : candidate)) ?? paths[0];
}

export function serveStatic(app: Express) {
  const distPath = firstExistingPath(
    [
      path.resolve(import.meta.dirname, "public"),
      path.resolve(import.meta.dirname, "..", "dist", "public"),
      path.resolve(process.cwd(), "dist", "public"),
    ],
    "index.html"
  );
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }

  // Vercel serves the generated root public/ directory from its CDN. Local Node
  // production runs still need this middleware to serve the same build output.
  if (!process.env.VERCEL) app.use(express.static(distPath, { index: false }));

  const entryPath = firstExistingPath([
    path.resolve(import.meta.dirname, "server-ssr", "entry-server.js"),
    path.resolve(import.meta.dirname, "..", "dist", "server-ssr", "entry-server.js"),
    path.resolve(process.cwd(), "dist", "server-ssr", "entry-server.js"),
  ]);
  const renderer = Promise.all([
    import(pathToFileURL(entryPath).href) as Promise<SsrEntry>,
    fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8"),
  ]);

  app.use("*", async (req, res, next) => {
    try {
      const [entry, template] = await renderer;
      const rendered = await entry.render(req.originalUrl);
      res.status(rendered.head.notFound ? 404 : 200).set({ "Content-Type": "text/html" }).end(composeHtml(template, rendered));
    } catch (error) {
      next(error);
    }
  });
}
