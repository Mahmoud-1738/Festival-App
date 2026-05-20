const CACHE = 'heartU-v1';

const PRECACHE = [
  './',
  './Festival%20App.html',
  './app-data.jsx',
  './app-markers.jsx',
  './app-screens.jsx',
  './app-map.jsx',
  './manifest.json',
  // Assets
  './assets/kaart_losse_lagen.png',
  './assets/logoBlack.webp',
  './assets/marker_stage1_ponton.svg',
  './assets/marker_stage3_the_club.svg',
  './assets/marker_stage4_hangar.svg',
  './assets/marker_entrance_exit.svg',
  './assets/marker_bar.svg',
  './assets/marker_food.svg',
  './assets/marker_toilet.svg',
  './assets/marker_locker.svg',
  './assets/marker_first_aid.svg',
  './assets/marker_ice_cream.svg',
  './assets/marker_merchandise.svg',
];

// External CDN resources to cache on first fetch
const CDN_HOSTS = [
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // CDN resources: cache-first
  if (CDN_HOSTS.some((h) => url.hostname.includes(h))) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Same-origin: cache-first, fallback to network then cache
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
