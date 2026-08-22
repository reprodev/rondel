import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.wav':  'audio/wav',
};

const server = http.createServer((req, res) => {
  const pathname = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      console.log(`GET ${pathname} -> 404`);
      return;
    }
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    console.log(`GET ${pathname} -> 200`);
  });
});

server.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
