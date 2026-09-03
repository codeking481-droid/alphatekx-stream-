const CACHE_NAME = 'alphatekx-v20-google-signup';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/styles.css'
];
const LEGACY_BAD_ASSET_PATH = '/api/auth/app.jsx';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Never fall back to a cached response for the legacy callback asset path.
  // It must remain a network-only 404 rather than resurrecting the old bundle.
  if (new URL(event.request.url).pathname === LEGACY_BAD_ASSET_PATH) {
    event.respondWith(fetch(event.request));
    return;
  }
  // Pass-through for dynamic API calls or fallback to network first
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
