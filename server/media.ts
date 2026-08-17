import { del, get, list, put } from "@vercel/blob";
import express, { type Express, type Request, type Response } from "express";
import { isAuthorizedEditorToken } from "./_core/decap.js";
import { ENV } from "./_core/env.js";

const MEDIA_PREFIX = "portfolio/";
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function publicMediaUrl(pathname: string) {
  return `/api/media/${pathname}`;
}

function accessTokenFromRequest(req: Request) {
  const value = req.get("authorization") ?? "";
  const match = /^(?:Bearer|token)\s+(.+)$/i.exec(value);
  return match?.[1]?.trim() ?? "";
}

function safeFilename(value: string) {
  const filename = value.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "").slice(0, 96);
  return filename || "portfolio-media";
}

export function isAllowedPortfolioMediaPath(pathname: string) {
  return pathname.startsWith(MEDIA_PREFIX) && pathname.length <= 260 && !pathname.includes("..") && /^[a-zA-Z0-9._/-]+$/.test(pathname);
}

async function requirePortfolioOwner(req: Request, res: Response) {
  const token = accessTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ message: "GitHub editor authentication is required." });
    return false;
  }
  if (!(await isAuthorizedEditorToken(token))) {
    res.status(403).json({ message: "Only the configured portfolio owner may manage media." });
    return false;
  }
  return true;
}

function mediaLibraryScript() {
  return `(() => {
  const MAX_FILE_BYTES = ${MAX_UPLOAD_BYTES};
  const TOKEN_KEY = "decap-cms-user";
  const getToken = () => {
    try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}").token || ""; } catch { return ""; }
  };
  const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: "Bearer " + token } : {};
  };
  const request = async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || "Media request failed.");
    return body;
  };
  const isImage = pathname => /\\.(avif|gif|jpe?g|png|webp)$/i.test(pathname);
  const createElement = (tag, properties = {}) => Object.assign(document.createElement(tag), properties);
  const mediaLibrary = {
    name: "vercel-blob",
    init: async ({ handleInsert } = {}) => {
      let dialog;
      const close = () => { dialog?.remove(); dialog = undefined; };
      const show = async () => {
        close();
        dialog = createElement("div", { className: "vercel-blob-media-overlay" });
        dialog.innerHTML = '<style>.vercel-blob-media-overlay{position:fixed;z-index:2147483647;inset:0;background:rgba(20,21,23,.68);display:grid;place-items:center;padding:24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.vercel-blob-media-dialog{box-sizing:border-box;width:min(920px,100%);max-height:min(760px,100%);overflow:auto;border-radius:18px;background:#f6f4ef;color:#1b1c1d;padding:24px;box-shadow:0 24px 80px rgba(0,0,0,.36)}.vercel-blob-media-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.vercel-blob-media-head h2{margin:0;font-size:24px}.vercel-blob-media-head p{margin:6px 0 0;color:#68665f}.vercel-blob-media-close,.vercel-blob-media-upload,.vercel-blob-media-use,.vercel-blob-media-delete{border:0;border-radius:999px;padding:9px 13px;font:600 13px system-ui;cursor:pointer}.vercel-blob-media-close{background:transparent;border:1px solid #c9c5bd}.vercel-blob-media-upload,.vercel-blob-media-use{background:#1b1c1d;color:#fff}.vercel-blob-media-delete{background:#fff;color:#9a2f2f;border:1px solid #dfb5b5}.vercel-blob-media-controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:22px 0}.vercel-blob-media-controls input,.vercel-blob-media-controls select{padding:9px;border:1px solid #c9c5bd;border-radius:9px;background:#fff;font:14px system-ui}.vercel-blob-media-controls input[type=file]{min-width:220px}.vercel-blob-media-status{min-height:22px;margin:0 0 14px;font-size:13px;color:#67655f}.vercel-blob-media-status.error{color:#9a2f2f}.vercel-blob-media-status.success{color:#146c43}.vercel-blob-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}.vercel-blob-media-item{background:#fff;border:1px solid #dedbd4;border-radius:12px;overflow:hidden}.vercel-blob-media-preview{display:grid;place-items:center;aspect-ratio:4/3;background:#e9e6df;color:#666;font-size:13px}.vercel-blob-media-preview img{width:100%;height:100%;object-fit:cover}.vercel-blob-media-meta{padding:10px}.vercel-blob-media-path{display:block;min-height:36px;overflow-wrap:anywhere;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace}.vercel-blob-media-actions{display:flex;gap:7px;margin-top:10px}.vercel-blob-media-empty{color:#67655f}</style><section class="vercel-blob-media-dialog" role="dialog" aria-modal="true" aria-label="Vercel Blob media library"><div class="vercel-blob-media-head"><div><h2>Media assets</h2><p>Stored privately in Vercel Blob and delivered from this site.</p></div><button class="vercel-blob-media-close" type="button">Close</button></div><div class="vercel-blob-media-controls"><input class="vercel-blob-media-file" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp,application/pdf" /><select class="vercel-blob-media-category"><option value="uploads">General upload</option><option value="hero">Hero image</option><option value="social">Social image</option><option value="resume">Resume</option></select><button class="vercel-blob-media-upload" type="button">Upload</button></div><p class="vercel-blob-media-status" aria-live="polite"></p><div class="vercel-blob-media-grid"></div></section>';
        document.body.append(dialog);
        const root = dialog.querySelector(".vercel-blob-media-dialog");
        const closeButton = dialog.querySelector(".vercel-blob-media-close");
        const uploadButton = dialog.querySelector(".vercel-blob-media-upload");
        const fileInput = dialog.querySelector(".vercel-blob-media-file");
        const category = dialog.querySelector(".vercel-blob-media-category");
        const status = dialog.querySelector(".vercel-blob-media-status");
        const grid = dialog.querySelector(".vercel-blob-media-grid");
        const setStatus = (message = "", kind = "") => { status.textContent = message; status.className = "vercel-blob-media-status " + kind; };
        const refresh = async () => {
          setStatus("Loading media…");
          try {
            const { media } = await request("/api/media/list");
            grid.replaceChildren();
            if (!media.length) { grid.append(createElement("p", { className: "vercel-blob-media-empty", textContent: "No media uploaded yet." })); }
            for (const entry of media) {
              const item = createElement("article", { className: "vercel-blob-media-item" });
              const preview = createElement("div", { className: "vercel-blob-media-preview" });
              if (isImage(entry.pathname)) preview.append(createElement("img", { src: entry.publicUrl, alt: "" })); else preview.textContent = "PDF";
              const meta = createElement("div", { className: "vercel-blob-media-meta" });
              meta.append(createElement("code", { className: "vercel-blob-media-path", textContent: entry.pathname }));
              const actions = createElement("div", { className: "vercel-blob-media-actions" });
              const use = createElement("button", { className: "vercel-blob-media-use", type: "button", textContent: "Use" });
              use.addEventListener("click", () => { handleInsert?.(entry.publicUrl); close(); });
              const remove = createElement("button", { className: "vercel-blob-media-delete", type: "button", textContent: "Delete" });
              remove.addEventListener("click", async () => { if (!confirm("Delete this media file permanently?")) return; try { await request("/api/media/" + entry.pathname, { method: "DELETE" }); setStatus("Media deleted.", "success"); await refresh(); } catch (error) { setStatus(error.message || "Delete failed.", "error"); } });
              actions.append(use, remove); meta.append(actions); item.append(preview, meta); grid.append(item);
            }
            setStatus();
          } catch (error) { setStatus(error.message || "Unable to load media. Sign in through Decap first.", "error"); }
        };
        closeButton.addEventListener("click", close);
        dialog.addEventListener("click", event => { if (event.target === dialog) close(); });
        uploadButton.addEventListener("click", async () => {
          const file = fileInput.files?.[0];
          if (!file) return setStatus("Choose a file first.", "error");
          if (file.size > MAX_FILE_BYTES) return setStatus("Media files must be 12 MB or smaller.", "error");
          uploadButton.disabled = true; setStatus("Uploading…");
          try {
            await request("/api/media/upload?filename=" + encodeURIComponent(file.name) + "&category=" + encodeURIComponent(category.value), { method: "POST", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
            fileInput.value = ""; setStatus("Upload complete.", "success"); await refresh();
          } catch (error) { setStatus(error.message || "Upload failed.", "error"); } finally { uploadButton.disabled = false; }
        });
        await refresh();
        root.focus?.();
      };
      return { show, hide: close, enableStandalone: () => true };
    },
  };
  if (window.CMS?.registerMediaLibrary) window.CMS.registerMediaLibrary(mediaLibrary);
})();`;
}

async function serveMedia(req: Request, res: Response) {
  const pathname = String(req.params[0] ?? "");
  if (!isAllowedPortfolioMediaPath(pathname)) return res.status(404).send("Not found");

  try {
    const result = await get(pathname, {
      access: "private",
      token: ENV.blobReadWriteToken,
      ifNoneMatch: req.get("if-none-match") ?? undefined,
    });
    if (!result) return res.status(404).send("Not found");
    res.status(result.statusCode);
    for (const header of ["content-type", "content-length", "content-disposition", "etag", "last-modified"]) {
      const value = result.headers.get(header);
      if (value) res.set(header, value);
    }
    res.set({ "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
    if (result.statusCode === 304 || !result.stream) return res.end();
    const body = Buffer.from(await new Response(result.stream as unknown as BodyInit).arrayBuffer());
    return res.send(body);
  } catch {
    return res.status(502).send("Media temporarily unavailable");
  }
}

export function registerMediaRoutes(app: Express) {
  app.get("/admin/vercel-blob-media-library.js", (_req, res) => {
    res.set({ "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    res.type("application/javascript").send(mediaLibraryScript());
  });

  app.get("/api/media/list", async (req, res) => {
    if (!(await requirePortfolioOwner(req, res))) return;
    try {
      const result = await list({ prefix: MEDIA_PREFIX, limit: 100, token: ENV.blobReadWriteToken });
      res.set("Cache-Control", "no-store").json({ media: result.blobs.map(blob => ({ pathname: blob.pathname, publicUrl: publicMediaUrl(blob.pathname) })) });
    } catch {
      res.status(502).json({ message: "Portfolio media is temporarily unavailable." });
    }
  });

  app.post("/api/media/upload", express.raw({ type: () => true, limit: MAX_UPLOAD_BYTES }), async (req, res) => {
    if (!(await requirePortfolioOwner(req, res))) return;
    const contentType = req.get("content-type")?.split(";")[0].trim().toLowerCase() ?? "";
    const filename = typeof req.query.filename === "string" ? req.query.filename : "";
    const category = typeof req.query.category === "string" ? req.query.category : "uploads";
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) return res.status(415).json({ message: "Upload a supported image or PDF file." });
    if (!/^(?:uploads|hero|social|resume)$/.test(category)) return res.status(400).json({ message: "Choose a valid media folder." });
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) return res.status(400).json({ message: "Choose a media file to upload." });

    try {
      const pathname = `${MEDIA_PREFIX}${category}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeFilename(filename)}`;
      const blob = await put(pathname, req.body, {
        access: "private",
        addRandomSuffix: false,
        contentType,
        cacheControlMaxAge: 31_536_000,
        token: ENV.blobReadWriteToken,
      });
      res.status(201).json({ pathname: blob.pathname, publicUrl: publicMediaUrl(blob.pathname) });
    } catch {
      res.status(502).json({ message: "Media upload failed. Please try again." });
    }
  });

  app.delete("/api/media/*", async (req, res) => {
    if (!(await requirePortfolioOwner(req, res))) return;
    const rawPath = (req.params as Record<string, unknown>)["0"];
    const pathname = typeof rawPath === "string" ? rawPath : "";
    if (!isAllowedPortfolioMediaPath(pathname)) return res.status(404).json({ message: "Media not found." });
    try {
      await del(pathname, { token: ENV.blobReadWriteToken });
      res.status(204).end();
    } catch {
      res.status(502).json({ message: "Media deletion failed. Please try again." });
    }
  });

  app.get("/api/media/*", serveMedia);
}
