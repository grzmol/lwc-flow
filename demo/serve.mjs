/**
 * Static server for the built demo, for looking at it locally.
 *
 * Node's own http module, because the demo has no runtime dependencies and neither should the
 * thing that serves it.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist/demo');
const PORT = Number(process.env.PORT ?? 8080);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

if (!fs.existsSync(DIST)) {
  console.error(`No build at ${DIST}. Run "npm run demo:build" first.`);
  process.exit(1);
}

http
  .createServer((request, response) => {
    const requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.join(DIST, requested === '/' ? 'index.html' : requested);

    // Never serve outside the build directory.
    if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  })
  .listen(PORT, () => console.log(`demo: http://localhost:${PORT}/`));
