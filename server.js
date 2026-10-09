const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Cache static files in memory for ultra-fast response (<1ms)
const memoryCache = new Map();

function getFileFromCacheOrDisk(filePath) {
  if (memoryCache.has(filePath)) {
    return memoryCache.get(filePath);
  }
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const isText = ext === '.html' || ext === '.css' || ext === '.js' || ext === '.json' || ext === '.svg';
    const gzip = isText ? zlib.gzipSync(data) : null;
    const entry = { data, gzip, mime, mtime: fs.statSync(filePath).mtimeMs };
    memoryCache.set(filePath, entry);
    return entry;
  } catch (e) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(path.join(ROOT, reqPath));
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const file = getFileFromCacheOrDisk(safePath);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': file.mime,
    'Cache-Control': 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*'
  };

  if (file.gzip && acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    res.end(file.gzip);
  } else {
    headers['Content-Length'] = file.data.length;
    res.writeHead(200, headers);
    res.end(file.data);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`High-performance static server running at http://localhost:${PORT}/`);
});
