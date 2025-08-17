const CACHE_NAME = "grammarbuddy-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",   // your only CSS file
  "/icons/icon-192-old.png",
  "/icons/icon-512-old.png"
];

// Install service worker & cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Serve cached content when offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Update cache when new version is deployed
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
