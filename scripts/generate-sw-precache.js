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

// Bible chapter JSON, fetched by the chapter pages' infinite scroll.
// verse-search.json (≈7 MB) is left out: it is cached the first time someone searches.
const chapters = [];
async function walkJson(dir, base) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base + '/' + entry.name;
    if (entry.isDirectory()) await walkJson(join(dir, entry.name), rel);
    else if (entry.name.endsWith('.json') && entry.name !== 'verse-search.json') chapters.push(rel);
  }
}
await walkJson(join(DIST, 'biblia', 'api'), '/biblia/api');

const precache = { pages, assets, chapters };
await writeFile(join(DIST, 'sw-precache.json'), JSON.stringify(precache));
console.log(`sw-precache.json: ${pages.length} pages, ${assets.length} assets, ${chapters.length} chapters`);
