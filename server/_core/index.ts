import "dotenv/config";
import { createServer } from "http";
import net from "net";
import { setupVite } from "./vite.js";
import { serveStatic } from "./ssrServer.js";
import { warmDatabaseConnection } from "../db.js";
import { warmTelegramConnection } from "../contact.js";
import { createApplication } from "./app.js";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = createApplication();
  const server = createServer(app);
  void Promise.allSettled([warmDatabaseConnection(), warmTelegramConnection()]).then(results => {
    const failed = results.filter(result => result.status === "rejected");
    if (failed.length) console.warn(`[Startup] ${failed.length} contact dependency warm-up task(s) did not complete.`);
  });
  // Development uses Vite; production reads the compiled public and SSR bundles.
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
