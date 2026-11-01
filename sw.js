// Service worker: precaches every file listed in precache.json (see tools/gen-precache.py).
// A new version installs in the background and only takes over once all windows are closed,
// so an update never changes the app mid-session.
// BUILD is rewritten by tools/gen-precache.py. It makes this file's bytes change on every release,
// which is how the browser notices there is a new version to install.
const BUILD = '840bfc1553';
const LIST = 'precache.json';
const PREFIX = 'fun-portal-';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const manifest = await (await fetch(LIST, { cache: 'no-store' })).json();
    const cache = await caches.open(PREFIX + manifest.version);
    await cache.addAll(manifest.files.map((f) => new Request(f, { cache: 'reload' })));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const hit = await caches.match(LIST);
    const current = hit ? PREFIX + (await hit.json()).version : null;
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== current) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      return await fetch(req);
    } catch (e) {
      if (req.mode === 'navigate') return (await caches.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
