const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js'
];
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyx916H_72LsiU9IV7LiFnZJ_wYNyWKbLMTBgvWvN6ZKGy51rc3-ei7nE6mDSLJ3H2f/exec';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(SCRIPT_URL)) {
    // This is the POST request to the Google Script.
    // Do not cache it, and allow it to go directly to the network.
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
