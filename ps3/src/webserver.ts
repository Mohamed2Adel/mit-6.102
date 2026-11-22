/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 *
 * PROVIDED CODE: tiny static web server for the web UI. Run with: npm run web
 * It only SENDS files (page, compiled JS, images) to the browser; all parsing and image
 * generation runs in the browser's JavaScript engine.
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const PORT = 8080;

// URL prefix -> folder on disk
const ROUTES: Array<[string, string]> = [
    ['/dist/', 'dist/'],
    ['/img/', 'img/'],
    ['/parserlib/', 'node_modules/parserlib/'],
    ['/', 'web/'],
];

const TYPES: Record<string, string> = {
    '.html': 'text/html', '.js': 'text/javascript', '.map': 'application/json', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
    let urlPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    if (urlPath === '/') { urlPath = '/index.html'; }
    if (urlPath === '/img/') {
        // the web UI asks for the list of image files
        const names = fs.readdirSync('img').filter(name => !name.startsWith('.'));
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(names));
        return;
    }
    for (const [prefix, folder] of ROUTES) {
        if (urlPath.startsWith(prefix)) {
            const file = path.normalize(path.join(folder, urlPath.substring(prefix.length)));
            if (!file.startsWith(path.normalize(folder)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
                break;
            }
            response.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream' });
            fs.createReadStream(file).pipe(response);
            return;
        }
    }
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('not found');
});

server.listen(PORT, 'localhost', () => {
    console.log(`web UI at http://localhost:${PORT}/  (Ctrl-C to stop)`);
    console.log('after editing code: npm run compile (or keep `npm run watch` running), then reload the page');
});
