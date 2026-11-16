const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../dist");
const types = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".html": "text/html",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".json": "application/json",
};
http
  .createServer((req, res) => {
    try {
      let file = path.resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if (
        !fs.existsSync(file) &&
        new URL(req.url, "http://localhost").pathname.startsWith("/_expo/")
      ) {
        res
          .writeHead(404)
          .end("Asset unavailable. Refresh after the export finishes.");
        return;
      }
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
        file = path.join(root, "index.html");
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      const stream = fs.createReadStream(file);
      stream.on("error", () => {
        if (!res.headersSent)
          res.writeHead(503).end("Preview is updating. Refresh shortly.");
        else res.destroy();
      });
      stream.pipe(res);
    } catch {
      res.writeHead(400).end();
    }
  })
  .listen(8082, "127.0.0.1", () =>
    console.log("HeyRik preview: http://127.0.0.1:8082"),
  );
