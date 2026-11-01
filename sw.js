// Service worker: saves every file listed in precache.json (see tools/gen-precache.py) so the app works offline.
// Each release has its own cache, named after BUILD. A new release installs, takes over straight away and deletes
// the old caches; the page then reloads itself the next time she is on the home screen (see portal/main.js).
// BUILD is rewritten by tools/gen-precache.py. It makes this file's bytes change on every release,
// which is how the browser notices there is a new version to install.
const BUILD = '23eab9216d';
const LIST = 'precache.json';
const PREFIX = 'fun-portal-';
const CACHE = PREFIX + BUILD;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const manifest = await (await fetch(LIST, { cache: 'no-store' })).json();
    const cache = await caches.open(CACHE);
    await cache.addAll(manifest.files.map((f) => new Request(f, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    // Only look in THIS release's cache, never in an older one.
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      return await fetch(req);
    } catch (e) {
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
