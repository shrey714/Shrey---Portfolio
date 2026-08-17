import { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config.js";
import { composeHtml } from "./ssr.js";

type SsrEntry = {
  render: (url: string) => Promise<import("../../client/src/entry-server.js").RenderResult>;
};

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      const entry = await vite.ssrLoadModule("/src/entry-server.tsx") as SsrEntry;
      const rendered = await entry.render(url);
      res.status(rendered.head.notFound ? 404 : 200).set({ "Content-Type": "text/html" }).end(composeHtml(page, rendered));
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
