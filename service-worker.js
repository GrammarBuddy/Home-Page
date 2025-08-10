// Define a unique name for the cache
const CACHE_NAME = 'grammarbuddy-cache-v1';

// List all the files you want to cache for offline use
// Be sure to include all CSS, JavaScript, and other assets.
// The paths are relative to the root of your GitHub Pages site.
const urlsToCache = [
  '/homepage/', // Your main index page
  '/homepage/index.html',
  '/homepage/styles.css', // Assuming you have a CSS file
  '/homepage/script.js', // Assuming you have a JavaScript file
  '/homepage/icons/icon-192x192.png', // The icon from the manifest
  '/homepage/icons/icon-512x512.png'  // The other icon
];

// Install event: Caches all the necessary files when the PWA is installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Intercepts network requests and serves content from the cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the resource is in the cache, return it
        if (response) {
          return response;
        }

        // Otherwise, fetch the resource from the network
        return fetch(event.request);
      })
  );
});

// Activate event: Cleans up old caches to ensure the app stays up to date
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name is not in the whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
