// Generates /sw-precache.json with all built page URLs for offline caching
import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

const DIST = join(import.meta.dirname, '..', 'dist');

async function walk(dir, base = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const urls = [];
  for (const entry of entries) {
    const rel = base + '/' + entry.name;
    if (entry.isDirectory()) {
      urls.push(...await walk(join(dir, entry.name), rel));
    } else if (entry.name === 'index.html') {
      // Convert /foo/index.html → /foo/
      const pageUrl = base ? base + '/' : '/';
      urls.push(pageUrl);
    }
  }
  return urls;
}

const pages = await walk(DIST);
const assets = [];

// Also collect hashed CSS/JS assets for precaching
const assetsDir = join(DIST, '_astro');
try {
  const files = await readdir(assetsDir);
  for (const f of files) {
    if (/\.(css|js)$/.test(f)) assets.push('/_astro/' + f);
  }
} catch {}

const precache = { pages, assets };
await writeFile(join(DIST, 'sw-precache.json'), JSON.stringify(precache));
console.log(`sw-precache.json: ${pages.length} pages, ${assets.length} assets`);
