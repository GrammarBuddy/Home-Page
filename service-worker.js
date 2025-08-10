const CACHE_NAME = 'grammarbuddy-cache-v2';
const OFFLINE_URL = '/homepage/offline.html';

const urlsToCache = [
  '/homepage/',
  '/homepage/index.html',
  '/homepage/offline.html',
  '/homepage/styles.css',
  '/homepage/script.js',
  '/homepage/icons/icon-192x192.png',
  '/homepage/icons/icon-512x512.png'
];

// Install: cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: try network first, fallback to cache, then offline page
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the fetched response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() =>
        caches.match(event.request)
          .then(cached => cached || caches.match(OFFLINE_URL))
      )
  );
});

// Background Sync for failed POST requests
self.addEventListener('sync', event => {
  if (event.tag === 'retry-posts') {
    event.waitUntil(retryQueuedPosts());
  }
});

async function retryQueuedPosts() {
  const queue = await getFailedRequests();
  for (const req of queue) {
    try {
      await fetch(req.url, { method: 'POST', body: req.body, headers: req.headers });
      console.log('Retried:', req.url);
    } catch (err) {
      console.error('Retry failed:', req.url);
    }
  }
}

// Placeholder: store failed POST requests (needs IndexedDB for real use)
async function getFailedRequests() {
  return []; // Implement your own storage logic
}

// Periodic Background Sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(
      fetch('/homepage/index.html')
        .then(res => caches.open(CACHE_NAME).then(cache => cache.put('/homepage/index.html', res)))
    );
  }
});
