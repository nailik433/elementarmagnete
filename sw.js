// Offline-Speicher für die Web-App (GitHub Pages / iPad-Home-Bildschirm).
// Liefert sofort die gespeicherte Version und holt im Hintergrund eine neuere,
// die beim nächsten Start angezeigt wird. Bei Änderungen CACHE hochzählen.
const CACHE = 'elementarmagnete-v1';
const FILES = ['./', './index.html', './nagel_magnetisierung.html', './manifest.webmanifest', './apple-touch-icon.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request, { ignoreSearch: true }).then((hit) => {
        const net = fetch(e.request)
          .then((res) => { if (res && res.ok) cache.put(e.request, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      })
    )
  );
});
