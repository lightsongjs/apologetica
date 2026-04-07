// Apologetica Service Worker — Full offline support
const CACHE_NAME = 'apologetica-v3';

// Core shell to precache on install (instant)
const PRECACHE_URLS = [
  '/',
  '/biblia/',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/search-data.json',
];

// Install: precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches, then background-cache all pages
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== 'google-fonts-cache').map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => backgroundCacheAll())
  );
});

// Background-cache all pages and assets from the build manifest
async function backgroundCacheAll() {
  try {
    const res = await fetch('/sw-precache.json');
    if (!res.ok) return;
    const { pages, assets } = await res.json();
    const cache = await caches.open(CACHE_NAME);
    const allUrls = [...pages, ...assets];

    // Cache in small batches to avoid overwhelming the network
    const BATCH_SIZE = 10;
    for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
      const batch = allUrls.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(
        batch.map(async (url) => {
          const existing = await cache.match(url);
          if (!existing) {
            try { await cache.add(url); } catch {}
          }
        })
      );
    }
  } catch {}
}

// Fetch: cache-first for everything (fully local experience)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Google Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, 'google-fonts-cache'));
    return;
  }

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Everything same-origin: network-first, cache fallback for offline
  event.respondWith(networkFirst(request));
});

// Try network first, fall back to cache when offline
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || caches.match('/');
  }
}

// Simple cache-first for fonts
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}
