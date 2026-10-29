import http from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dir = fileURLToPath(new URL(".", import.meta.url));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".json": "application/json" };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/visit") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const fakeReq = { method: req.method, headers: req.headers, body };
    let statusCode = 200;
    const fakeRes = {
      status(code) { statusCode = code; return this; },
      end() { res.writeHead(statusCode); res.end(); },
      json(data) { res.writeHead(statusCode, { "content-type": "application/json" }); res.end(JSON.stringify(data)); },
    };
    const handler = (await import("./api/visit.js?t=" + Date.now())).default;
    await handler(fakeReq, fakeRes);
    return;
  }

  let filePath = join(__dir, url.pathname === "/" ? "index.html" : url.pathname);
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000, () => console.log("Dev server → http://localhost:3000"));
