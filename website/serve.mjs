import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = 3000;

// Load .env.local into process.env for local dev (gitignored — never committed).
// On Vercel these come from the project's Environment Variables instead.
try {
  const txt = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  for (const line of txt.split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch { /* no .env.local — fine */ }

// Apply the same security headers as production (vercel.json), so local tests
// run under the real Content-Security-Policy and catch anything it would block.
const securityHeaders = {};
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const siteWide = (vercelConfig.headers || []).find(rule => rule.source === '/(.*)');
  for (const { key, value } of (siteWide ? siteWide.headers : [])) securityHeaders[key] = value;
} catch { /* no vercel.json headers — serve without them */ }

const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

// Minimal Vercel-style res shim so /api functions run unchanged locally.
function makeRes(res) {
  const headers = { ...securityHeaders };
  let statusCode = 200;
  return {
    setHeader(k, v) { headers[k] = v; },
    status(code) { statusCode = code; return this; },
    json(obj) {
      headers['Content-Type'] = 'application/json';
      res.writeHead(statusCode, headers);
      res.end(JSON.stringify(obj));
    },
    end(data) { res.writeHead(statusCode, headers); res.end(data); },
  };
}

http.createServer(async (req, res) => {
  const [rawPath, rawQuery = ''] = req.url.split('?');
  let urlPath = decodeURIComponent(rawPath);

  // Run the matching serverless function for /api/* routes (mirrors Vercel).
  if (urlPath.startsWith('/api/')) {
    const name = urlPath.slice(5).replace(/[^a-zA-Z0-9_-]/g, '');
    const fnPath = path.join(ROOT, 'api', name + '.js');
    if (!name || !fs.existsSync(fnPath)) {
      res.writeHead(404); res.end('No such API route'); return;
    }
    const query = Object.fromEntries(new URLSearchParams(rawQuery));
    try {
      const handler = require(fnPath);
      await handler({ method: req.method, query, url: req.url, headers: req.headers }, makeRes(res));
    } catch (e) {
      res.writeHead(500); res.end('API error: ' + e.message);
    }
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { ...securityHeaders, 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
