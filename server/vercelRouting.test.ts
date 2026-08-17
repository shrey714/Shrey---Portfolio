import http from "node:http";
import { once } from "node:events";
import { afterAll, beforeAll, expect, test } from "vitest";
import app from "../api/index";

let server: http.Server;
let origin: string;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not receive a TCP port.");
  origin = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  server.close();
  await once(server, "close");
});

test("unified Vercel entry returns tRPC JSON instead of an HTML 404", async () => {
  const response = await fetch(`${origin}/api/trpc/system.health?input=${encodeURIComponent(JSON.stringify({ json: { timestamp: 0 } }))}`);
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("application/json");
});

test("unified Vercel entry serves the private Decap shell with noindex", async () => {
  const response = await fetch(`${origin}/admin`);
  expect(response.status).toBe(200);
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  const html = await response.text();
  expect(html).toContain("decap-cms");
  expect(html).not.toContain("CMS_MANUAL_INIT");
  expect(html).not.toContain("CMS.init");
});

test("unified Vercel entry provides Decap's conventional configuration fallback", async () => {
  const response = await fetch(`${origin}/config.yml`);
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/yaml");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  const config = await response.json() as { backend: Record<string, string>; media_folder?: string; public_folder?: string };
  expect(config.backend.repo).toBe("shrey714/Shrey---Portfolio");
  expect(config.backend.api_root).toBe(`${origin}/api/decap/github`);
  expect(config.media_folder).toBe("content/media");
  expect(config.public_folder).toBe("/media");
});

test("Decap GitHub proxy rejects unauthenticated repository calls without contacting GitHub", async () => {
  const response = await fetch(`${origin}/api/decap/github/repos/shrey714/Shrey---Portfolio/git/blobs`);
  expect(response.status).toBe(401);
  expect(await response.json()).toMatchObject({ message: "Editor authentication is required." });
});
