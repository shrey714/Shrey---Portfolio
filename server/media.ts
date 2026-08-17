import { get, list, put } from "@vercel/blob";
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
    res.status(403).json({ message: "Only the configured portfolio owner may upload media." });
    return false;
  }
  return true;
}

function mediaManagerDocument() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,nofollow" /><title>Portfolio media</title><style>body{margin:0;background:#f6f4ef;color:#1b1c1d;font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{max-width:780px;margin:0 auto;padding:48px 24px 80px}a{color:inherit}.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6b6a66}.back{display:inline-block;margin-bottom:32px;font-size:13px}.card{background:#fff;border:1px solid #dedbd4;border-radius:18px;padding:24px;margin-top:22px}.field{display:block;margin:14px 0 8px;font-weight:650}input,select,button{font:inherit}input,select{box-sizing:border-box;width:100%;border:1px solid #c9c5bd;border-radius:10px;padding:11px;background:#fff}button{border:0;border-radius:999px;background:#1b1c1d;color:#fff;padding:11px 16px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}.note{color:#67655f;font-size:13px}.status{margin-top:14px;font-size:14px}.items{display:grid;gap:10px;margin-top:16px}.item{display:flex;gap:12px;justify-content:space-between;align-items:center;border-top:1px solid #e2dfd8;padding-top:10px}.item code{font-size:12px;overflow-wrap:anywhere}.item button{font-size:12px;padding:7px 11px;background:#456fe8}.empty{color:#67655f}.error{color:#9a2f2f}.success{color:#146c43}</style></head><body><main class="shell"><a class="back" href="/admin">← Back to content editor</a><p class="eyebrow">Private asset manager</p><h1>Portfolio media</h1><p>Upload an image or resume PDF to the portfolio’s private Vercel Blob store. Use the generated site URL in the relevant Decap field.</p><section class="card"><form id="upload-form"><label class="field" for="file">Media file</label><input id="file" name="file" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp,application/pdf" required /><label class="field" for="category">Folder</label><select id="category" name="category"><option value="uploads">General upload</option><option value="hero">Hero image</option><option value="social">Social image</option><option value="resume">Resume</option></select><p class="note">Allowed: AVIF, GIF, JPEG, PNG, WebP, and PDF. Maximum size: 12 MB. The file remains private in storage and is served only from this site’s media route.</p><button type="submit">Upload media</button><p id="status" class="status" aria-live="polite"></p></form></section><section class="card"><h2>Available media</h2><p class="note">Copy a site URL, then paste it into Decap. Use a hero/social URL for images and a resume URL for the Download Resume field.</p><div id="items" class="items"><p class="empty">Loading media…</p></div></section></main><script>const state=document.getElementById("status"),items=document.getElementById("items"),form=document.getElementById("upload-form");function token(){try{return JSON.parse(localStorage.getItem("decap-cms-user")||"{}").token||""}catch{return ""}}function auth(){const value=token();return value?{Authorization:"Bearer "+value}:{}}function setStatus(message,kind=""){state.textContent=message;state.className="status "+kind}async function copy(value){await navigator.clipboard.writeText(value);setStatus("Site URL copied. Paste it into the matching Decap field.","success")}function render(media){items.replaceChildren();if(!media.length){const empty=document.createElement("p");empty.className="empty";empty.textContent="No portfolio media uploaded yet.";items.append(empty);return}for(const entry of media){const row=document.createElement("div");row.className="item";const text=document.createElement("code");text.textContent=entry.publicUrl;const button=document.createElement("button");button.type="button";button.textContent="Copy URL";button.addEventListener("click",()=>copy(entry.publicUrl));row.append(text,button);items.append(row)}}async function load(){const response=await fetch("/api/media/list",{headers:auth()});if(!response.ok){throw new Error(response.status===401?"Sign in through the content editor first.":"Unable to load media.")}render((await response.json()).media)}form.addEventListener("submit",async event=>{event.preventDefault();const file=document.getElementById("file").files[0];const category=document.getElementById("category").value;if(!file)return;const button=form.querySelector("button");button.disabled=true;setStatus("Uploading…");try{const response=await fetch("/api/media/upload?filename="+encodeURIComponent(file.name)+"&category="+encodeURIComponent(category),{method:"POST",headers:{...auth(),"Content-Type":file.type||"application/octet-stream"},body:file});const data=await response.json();if(!response.ok)throw new Error(data.message||"Upload failed.");setStatus("Upload complete. The site URL is ready to copy below.","success");document.getElementById("file").value="";await load()}catch(error){setStatus(error instanceof Error?error.message:"Upload failed.","error")}finally{button.disabled=false}});load().catch(error=>setStatus(error instanceof Error?error.message:"Unable to load media.","error"));</script></body></html>`;
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
  app.get("/admin/media", (_req, res) => {
    res.set("X-Robots-Tag", "noindex, nofollow");
    res.type("html").send(mediaManagerDocument());
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

  app.get("/api/media/*", serveMedia);
}
